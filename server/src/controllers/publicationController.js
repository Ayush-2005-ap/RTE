const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { uploadFromBuffer, deleteFromCloudinary } = require('../services/uploadService');

/**
 * GET /api/v1/publications — Public: list all publications
 */
exports.getAllPublications = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const filter = {};

  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.OR = [
      { title: { contains: req.query.search, mode: 'insensitive' } },
      { description: { contains: req.query.search, mode: 'insensitive' } }
    ];
  }

  const skip = (page - 1) * limit;

  const [publications, total] = await Promise.all([
    prisma.publication.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { uploadedBy: { select: { name: true } } }
    }),
    prisma.publication.count({ where: filter })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      publications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  });
});

/**
 * GET /api/v1/publications/:id — Public: get single publication
 */
exports.getPublication = catchAsync(async (req, res, next) => {
  const publication = await prisma.publication.findUnique({
    where: { id: req.params.id },
    include: { uploadedBy: { select: { name: true } } }
  });

  if (!publication) {
    return next(new AppError('No publication found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { publication }
  });
});

/**
 * POST /api/v1/publications/:id/download — increment download count
 */
exports.trackDownload = catchAsync(async (req, res, next) => {
  await prisma.publication.update({
    where: { id: req.params.id },
    data: { downloadCount: { increment: 1 } }
  });
  res.status(200).json({ status: 'success' });
});

/**
 * POST /api/v1/publications — Admin: create a publication
 * Expects multipart/form-data with fields: title, description, category, tags, publishedAt
 * Files: pdf (required), thumbnail (optional)
 */
exports.createPublication = catchAsync(async (req, res, next) => {
  const { title, description, category, tags, publishedAt } = req.body;

  if (!req.files || !req.files.pdf) {
    return next(new AppError('Please upload a PDF file', 400));
  }

  // 1) Upload PDF to Supabase Storage
  const pdfResult = await uploadFromBuffer(
    req.files.pdf[0].buffer,
    'rte/publications/pdfs',
    req.files.pdf[0].mimetype
  );
  const pdfUrl = pdfResult.secure_url;
  const pdfPublicId = pdfResult.public_id;

  // 2) Optionally upload thumbnail to Supabase Storage
  let thumbnailUrl = null;
  let thumbnailPublicId = null;
  if (req.files.thumbnail && req.files.thumbnail[0]) {
    const thumbResult = await uploadFromBuffer(
      req.files.thumbnail[0].buffer,
      'rte/publications/thumbnails',
      req.files.thumbnail[0].mimetype
    );
    thumbnailUrl = thumbResult.secure_url;
    thumbnailPublicId = thumbResult.public_id;
  }

  const publication = await prisma.publication.create({
    data: {
      title,
      description,
      pdfUrl,
      pdfPublicId,
      thumbnailUrl,
      thumbnailPublicId,
      category: category || 'other',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      uploadedById: req.user.id
    },
    include: { uploadedBy: { select: { name: true } } }
  });

  res.status(201).json({
    status: 'success',
    data: { publication }
  });
});

/**
 * PATCH /api/v1/publications/:id — Admin: update a publication
 */
exports.updatePublication = catchAsync(async (req, res, next) => {
  const existingPub = await prisma.publication.findUnique({ where: { id: req.params.id } });
  
  if (!existingPub) {
    return next(new AppError('No publication found with that ID', 404));
  }

  const { title, description, category, tags, publishedAt } = req.body;
  const updateData = {};

  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (category) updateData.category = category;
  if (tags) updateData.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
  if (publishedAt) updateData.publishedAt = new Date(publishedAt);

  // Replace PDF if provided
  if (req.files && req.files.pdf && req.files.pdf[0]) {
    if (existingPub.pdfPublicId) {
      await deleteFromCloudinary(existingPub.pdfPublicId);
    }
    const pdfResult = await uploadFromBuffer(
      req.files.pdf[0].buffer,
      'rte/publications/pdfs',
      req.files.pdf[0].mimetype
    );
    updateData.pdfUrl = pdfResult.secure_url;
    updateData.pdfPublicId = pdfResult.public_id;
  }

  // Replace thumbnail if provided
  if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
    if (existingPub.thumbnailPublicId) {
      await deleteFromCloudinary(existingPub.thumbnailPublicId);
    }
    const thumbResult = await uploadFromBuffer(
      req.files.thumbnail[0].buffer,
      'rte/publications/thumbnails',
      req.files.thumbnail[0].mimetype
    );
    updateData.thumbnailUrl = thumbResult.secure_url;
    updateData.thumbnailPublicId = thumbResult.public_id;
  }

  const publication = await prisma.publication.update({
    where: { id: req.params.id },
    data: updateData,
    include: { uploadedBy: { select: { name: true } } }
  });

  res.status(200).json({
    status: 'success',
    data: { publication }
  });
});

/**
 * DELETE /api/v1/publications/:id — Admin: delete a publication
 */
exports.deletePublication = catchAsync(async (req, res, next) => {
  const existingPub = await prisma.publication.findUnique({ where: { id: req.params.id } });
  
  if (!existingPub) {
    return next(new AppError('No publication found with that ID', 404));
  }

  // Delete PDF from Supabase
  if (existingPub.pdfPublicId) {
    await deleteFromCloudinary(existingPub.pdfPublicId);
  }

  // Delete thumbnail from Supabase
  if (existingPub.thumbnailPublicId) {
    await deleteFromCloudinary(existingPub.thumbnailPublicId);
  }

  await prisma.publication.delete({ where: { id: req.params.id } });

  res.status(204).json({ status: 'success', data: null });
});
