const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

/**
 * GET /api/v1/comments?type=blog&id=xxx — Public: list comments for a content item
 */
exports.getComments = catchAsync(async (req, res, next) => {
  const { type, id } = req.query;

  if (!type || !id) {
    return next(new AppError('Please provide content type and id', 400));
  }

  if (!['blog', 'news'].includes(type)) {
    return next(new AppError('Content type must be blog or news', 400));
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { contentType: type, contentId: id, isApproved: true };

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.comment.count({ where: filter })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  });
});

/**
 * GET /api/v1/comments/all — Admin: list all comments (with pagination)
 */
exports.getAllCommentsAdmin = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.type) filter.contentType = req.query.type;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.comment.count({ where: filter })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  });
});

/**
 * POST /api/v1/comments — Public: post a new comment (no login required)
 */
exports.createComment = catchAsync(async (req, res, next) => {
  const { contentType, contentId, authorName, body } = req.body;

  if (!['blog', 'news'].includes(contentType)) {
    return next(new AppError('Content type must be blog or news', 400));
  }

  // Verify the content exists
  if (contentType === 'blog') {
    const post = await prisma.blogPost.findUnique({ where: { id: contentId } });
    if (!post) return next(new AppError('Blog post not found', 404));
    
    await prisma.blogPost.update({
      where: { id: contentId },
      data: { commentCount: { increment: 1 } }
    });
  } else {
    const news = await prisma.news.findUnique({ where: { id: contentId } });
    if (!news) return next(new AppError('News item not found', 404));
    
    await prisma.news.update({
      where: { id: contentId },
      data: { commentCount: { increment: 1 } }
    });
  }

  const comment = await prisma.comment.create({
    data: {
      contentType,
      contentId,
      authorName: authorName || 'Anonymous',
      body
    }
  });

  res.status(201).json({
    status: 'success',
    data: { comment }
  });
});

/**
 * DELETE /api/v1/comments/:id — Admin: delete a comment
 */
exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await prisma.comment.findUnique({ where: { id: req.params.id } });
  
  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  // Decrement count on parent content
  if (comment.contentType === 'blog') {
    await prisma.blogPost.update({
      where: { id: comment.contentId },
      data: { commentCount: { decrement: 1 } }
    }).catch(() => {});
  } else {
    await prisma.news.update({
      where: { id: comment.contentId },
      data: { commentCount: { decrement: 1 } }
    }).catch(() => {});
  }

  await prisma.comment.delete({ where: { id: req.params.id } });

  res.status(204).json({ status: 'success', data: null });
});
