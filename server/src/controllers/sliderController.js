const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { uploadFromBuffer, deleteFromCloudinary } = require('../services/uploadService');

/**
 * GET /api/v1/slider — Public: get all active slides (ordered)
 */
exports.getAllSlides = catchAsync(async (req, res, next) => {
  const slides = await prisma.sliderSlide.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  res.status(200).json({
    status: 'success',
    results: slides.length,
    data: { slides }
  });
});

/**
 * GET /api/v1/slider/all — Admin: get ALL slides (including inactive)
 */
exports.getAllSlidesAdmin = catchAsync(async (req, res, next) => {
  const slides = await prisma.sliderSlide.findMany({
    orderBy: { order: 'asc' }
  });

  res.status(200).json({
    status: 'success',
    results: slides.length,
    data: { slides }
  });
});

/**
 * POST /api/v1/slider — Admin: create a new slide
 * Expects multipart/form-data with image file + text fields
 */
exports.createSlide = catchAsync(async (req, res, next) => {
  const {
    leftCategory, leftReadTime, leftTitle, leftDesc, leftLink,
    rightLabel, rightTitle, rightDesc, order, isActive
  } = req.body;

  if (!req.file) {
    return next(new AppError('Please upload a left image for the slide', 400));
  }

  // Upload image to Supabase
  const result = await uploadFromBuffer(req.file.buffer, 'rte/slider', req.file.mimetype);

  // Get the next order number if not provided
  let slideOrder = parseInt(order);
  if (isNaN(slideOrder)) {
    const lastSlide = await prisma.sliderSlide.findFirst({
      orderBy: { order: 'desc' }
    });
    slideOrder = lastSlide ? lastSlide.order + 1 : 0;
  }

  const slide = await prisma.sliderSlide.create({
    data: {
      order: slideOrder,
      leftImageUrl: result.secure_url,
      leftImagePublicId: result.public_id,
      leftCategory,
      leftReadTime: leftReadTime || '3 Min Read',
      leftTitle,
      leftDesc,
      leftLink: leftLink || '#',
      rightLabel,
      rightTitle,
      rightDesc,
      isActive: isActive !== 'false',
      createdById: req.user.id
    }
  });

  res.status(201).json({
    status: 'success',
    data: { slide }
  });
});

/**
 * PATCH /api/v1/slider/:id — Admin: update a slide
 */
exports.updateSlide = catchAsync(async (req, res, next) => {
  const existingSlide = await prisma.sliderSlide.findUnique({ where: { id: req.params.id } });
  
  if (!existingSlide) {
    return next(new AppError('No slide found with that ID', 404));
  }

  const {
    leftCategory, leftReadTime, leftTitle, leftDesc, leftLink,
    rightLabel, rightTitle, rightDesc, order, isActive
  } = req.body;

  const updateData = {};

  if (leftCategory !== undefined) updateData.leftCategory = leftCategory;
  if (leftReadTime !== undefined) updateData.leftReadTime = leftReadTime;
  if (leftTitle !== undefined) updateData.leftTitle = leftTitle;
  if (leftDesc !== undefined) updateData.leftDesc = leftDesc;
  if (leftLink !== undefined) updateData.leftLink = leftLink;
  if (rightLabel !== undefined) updateData.rightLabel = rightLabel;
  if (rightTitle !== undefined) updateData.rightTitle = rightTitle;
  if (rightDesc !== undefined) updateData.rightDesc = rightDesc;
  if (order !== undefined) updateData.order = parseInt(order);
  if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

  // Replace image if a new one is provided
  if (req.file) {
    if (existingSlide.leftImagePublicId) {
      await deleteFromCloudinary(existingSlide.leftImagePublicId);
    }
    const result = await uploadFromBuffer(req.file.buffer, 'rte/slider', req.file.mimetype);
    updateData.leftImageUrl = result.secure_url;
    updateData.leftImagePublicId = result.public_id;
  }

  const slide = await prisma.sliderSlide.update({
    where: { id: req.params.id },
    data: updateData
  });

  res.status(200).json({
    status: 'success',
    data: { slide }
  });
});

/**
 * DELETE /api/v1/slider/:id — Admin: delete a slide
 */
exports.deleteSlide = catchAsync(async (req, res, next) => {
  const existingSlide = await prisma.sliderSlide.findUnique({ where: { id: req.params.id } });
  
  if (!existingSlide) {
    return next(new AppError('No slide found with that ID', 404));
  }

  // Delete image from Supabase
  if (existingSlide.leftImagePublicId) {
    await deleteFromCloudinary(existingSlide.leftImagePublicId);
  }

  await prisma.sliderSlide.delete({ where: { id: req.params.id } });

  res.status(204).json({ status: 'success', data: null });
});

/**
 * PATCH /api/v1/slider/reorder — Admin: reorder slides
 * Body: { slides: [{ id, order }] }
 */
exports.reorderSlides = catchAsync(async (req, res, next) => {
  const { slides } = req.body;
  if (!slides || !Array.isArray(slides)) {
    return next(new AppError('Please provide slides array with id and order', 400));
  }

  // Update in a transaction
  await prisma.$transaction(
    slides.map(({ id, order }) => 
      prisma.sliderSlide.update({
        where: { id },
        data: { order }
      })
    )
  );

  res.status(200).json({
    status: 'success',
    message: 'Slides reordered successfully'
  });
});
