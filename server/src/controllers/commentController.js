const Comment = require('../models/Comment');
const News = require('../models/News');
const BlogPost = require('../models/BlogPost');
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

  const result = await Comment.paginate(
    { contentType: type, contentId: id, isApproved: true },
    { page, limit, sort: { createdAt: -1 } }
  );

  res.status(200).json({
    status: 'success',
    data: {
      comments: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      total: result.totalDocs
    }
  });
});

/**
 * GET /api/v1/comments/all — Admin: list all comments (with pagination)
 */
exports.getAllCommentsAdmin = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;

  const filter = {};
  if (req.query.type) filter.contentType = req.query.type;

  const result = await Comment.paginate(filter, {
    page,
    limit,
    sort: { createdAt: -1 }
  });

  res.status(200).json({
    status: 'success',
    data: {
      comments: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      total: result.totalDocs
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
    const post = await BlogPost.findById(contentId);
    if (!post) return next(new AppError('Blog post not found', 404));
    await BlogPost.findByIdAndUpdate(contentId, { $inc: { commentCount: 1 } });
  } else {
    const news = await News.findById(contentId);
    if (!news) return next(new AppError('News item not found', 404));
    await News.findByIdAndUpdate(contentId, { $inc: { commentCount: 1 } });
  }

  const comment = await Comment.create({
    contentType,
    contentId,
    authorName: authorName || 'Anonymous',
    body
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
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  // Decrement count on parent content
  if (comment.contentType === 'blog') {
    await BlogPost.findByIdAndUpdate(comment.contentId, {
      $inc: { commentCount: -1 }
    });
  } else {
    await News.findByIdAndUpdate(comment.contentId, {
      $inc: { commentCount: -1 }
    });
  }

  await Comment.findByIdAndDelete(req.params.id);

  res.status(204).json({ status: 'success', data: null });
});
