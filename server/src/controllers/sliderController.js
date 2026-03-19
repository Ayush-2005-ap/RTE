const SliderSlide = require('../models/SliderSlide');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper: Upload image buffer to Cloudinary
const uploadImageToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * GET /api/v1/slider — Public: get all active slides (ordered)
 */
exports.getAllSlides = catchAsync(async (req, res, next) => {
  const slides = await SliderSlide.find({ isActive: true }).sort({ order: 1 });

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
  const slides = await SliderSlide.find().sort({ order: 1 });

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

  // Upload image to Cloudinary
  const result = await uploadImageToCloudinary(req.file.buffer, 'rte/slider');

  // Get the next order number if not provided
  let slideOrder = parseInt(order);
  if (isNaN(slideOrder)) {
    const lastSlide = await SliderSlide.findOne().sort({ order: -1 });
    slideOrder = lastSlide ? lastSlide.order + 1 : 0;
  }

  const slide = await SliderSlide.create({
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
    createdBy: req.user.id
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
  const slide = await SliderSlide.findById(req.params.id);
  if (!slide) {
    return next(new AppError('No slide found with that ID', 404));
  }

  const {
    leftCategory, leftReadTime, leftTitle, leftDesc, leftLink,
    rightLabel, rightTitle, rightDesc, order, isActive
  } = req.body;

  if (leftCategory !== undefined) slide.leftCategory = leftCategory;
  if (leftReadTime !== undefined) slide.leftReadTime = leftReadTime;
  if (leftTitle !== undefined) slide.leftTitle = leftTitle;
  if (leftDesc !== undefined) slide.leftDesc = leftDesc;
  if (leftLink !== undefined) slide.leftLink = leftLink;
  if (rightLabel !== undefined) slide.rightLabel = rightLabel;
  if (rightTitle !== undefined) slide.rightTitle = rightTitle;
  if (rightDesc !== undefined) slide.rightDesc = rightDesc;
  if (order !== undefined) slide.order = parseInt(order);
  if (isActive !== undefined) slide.isActive = isActive === 'true' || isActive === true;

  // Replace image if a new one is provided
  if (req.file) {
    if (slide.leftImagePublicId) {
      await cloudinary.uploader.destroy(slide.leftImagePublicId);
    }
    const result = await uploadImageToCloudinary(req.file.buffer, 'rte/slider');
    slide.leftImageUrl = result.secure_url;
    slide.leftImagePublicId = result.public_id;
  }

  await slide.save();

  res.status(200).json({
    status: 'success',
    data: { slide }
  });
});

/**
 * DELETE /api/v1/slider/:id — Admin: delete a slide
 */
exports.deleteSlide = catchAsync(async (req, res, next) => {
  const slide = await SliderSlide.findById(req.params.id);
  if (!slide) {
    return next(new AppError('No slide found with that ID', 404));
  }

  // Delete image from Cloudinary
  if (slide.leftImagePublicId) {
    await cloudinary.uploader.destroy(slide.leftImagePublicId);
  }

  await SliderSlide.findByIdAndDelete(req.params.id);

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

  const updates = slides.map(({ id, order }) =>
    SliderSlide.findByIdAndUpdate(id, { order }, { new: true })
  );

  await Promise.all(updates);

  res.status(200).json({
    status: 'success',
    message: 'Slides reordered successfully'
  });
});
