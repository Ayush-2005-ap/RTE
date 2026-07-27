const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { uploadFromBuffer, deleteFromCloudinary } = require('../services/uploadService');

/**
 * GET /api/v1/news — Public: list news with pagination & filters
 */
exports.getAllNews = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const filter = {};

  if (req.query.state) filter.state = req.query.state;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.OR = [
      { title: { contains: req.query.search, mode: 'insensitive' } },
      { summary: { contains: req.query.search, mode: 'insensitive' } }
    ];
  }

  const skip = (page - 1) * limit;

  const [news, total] = await Promise.all([
    prisma.news.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { addedBy: { select: { name: true } } }
    }),
    prisma.news.count({ where: filter })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  });
});

/**
 * GET /api/v1/news/:id — Public: get single news item
 */
exports.getNews = catchAsync(async (req, res, next) => {
  const news = await prisma.news.findUnique({
    where: { id: req.params.id },
    include: { addedBy: { select: { name: true } } }
  });

  if (!news) {
    return next(new AppError('No news item found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { news }
  });
});

/**
 * POST /api/v1/news — Admin: create a news item
 */
exports.createNews = catchAsync(async (req, res, next) => {
  const { title, summary, body, source, sourceUrl, state, category, publishedAt } = req.body;

  let imageUrl = null;
  let imagePublicId = null;

  if (req.file) {
    const result = await uploadFromBuffer(req.file.buffer, 'rte/news');
    imageUrl = result.secure_url;
    imagePublicId = result.public_id;
  }

  const news = await prisma.news.create({
    data: {
      title,
      summary,
      body,
      source,
      sourceUrl,
      imageUrl,
      imagePublicId,
      state: state || 'All India',
      category: category || 'other',
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      addedById: req.user.id
    },
    include: { addedBy: { select: { name: true } } }
  });

  res.status(201).json({
    status: 'success',
    data: { news }
  });
});

/**
 * PATCH /api/v1/news/:id — Admin: update a news item
 */
exports.updateNews = catchAsync(async (req, res, next) => {
  const existingNews = await prisma.news.findUnique({ where: { id: req.params.id } });
  
  if (!existingNews) {
    return next(new AppError('No news item found with that ID', 404));
  }

  const { title, summary, body, source, sourceUrl, state, category, publishedAt } = req.body;
  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (summary !== undefined) updateData.summary = summary;
  if (body !== undefined) updateData.body = body;
  if (source !== undefined) updateData.source = source;
  if (sourceUrl !== undefined) updateData.sourceUrl = sourceUrl;
  if (state !== undefined) updateData.state = state;
  if (category !== undefined) updateData.category = category;
  if (publishedAt !== undefined) updateData.publishedAt = new Date(publishedAt);

  if (req.file) {
    if (existingNews.imagePublicId) {
      await deleteFromCloudinary(existingNews.imagePublicId);
    }
    const result = await uploadFromBuffer(req.file.buffer, 'rte/news');
    updateData.imageUrl = result.secure_url;
    updateData.imagePublicId = result.public_id;
  }

  const news = await prisma.news.update({
    where: { id: req.params.id },
    data: updateData,
    include: { addedBy: { select: { name: true } } }
  });

  res.status(200).json({
    status: 'success',
    data: { news }
  });
});

/**
 * DELETE /api/v1/news/:id — Admin: delete a news item
 */
exports.deleteNews = catchAsync(async (req, res, next) => {
  const existingNews = await prisma.news.findUnique({ where: { id: req.params.id } });
  
  if (!existingNews) {
    return next(new AppError('No news item found with that ID', 404));
  }

  if (existingNews.imagePublicId) {
    await deleteFromCloudinary(existingNews.imagePublicId);
  }

  await prisma.news.delete({ where: { id: req.params.id } });

  res.status(204).json({ status: 'success', data: null });
});
