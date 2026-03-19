const Publication = require('../models/Publication');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const cloudinary = require('../config/cloudinary');
const { uploadPDF, deletePDF } = require('../services/supabaseStorage');
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
 * GET /api/v1/publications — Public: list all publications
 */
exports.getAllPublications = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const filter = {};

  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const options = {
    page,
    limit,
    sort: { publishedAt: -1 },
    populate: { path: 'uploadedBy', select: 'name' }
  };

  const result = await Publication.paginate(filter, options);

  res.status(200).json({
    status: 'success',
    data: {
      publications: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      total: result.totalDocs
    }
  });
});

/**
 * GET /api/v1/publications/:id — Public: get single publication
 */
exports.getPublication = catchAsync(async (req, res, next) => {
  const publication = await Publication.findById(req.params.id)
    .populate('uploadedBy', 'name');

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
  await Publication.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });
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

  // 1) Upload PDF to Supabase
  const { pdfUrl, pdfPath } = await uploadPDF(
    req.files.pdf[0].buffer,
    req.files.pdf[0].originalname
  );

  // 2) Optionally upload thumbnail to Cloudinary
  let thumbnailUrl, thumbnailPublicId;
  if (req.files.thumbnail && req.files.thumbnail[0]) {
    const result = await uploadImageToCloudinary(
      req.files.thumbnail[0].buffer,
      'rte/publications'
    );
    thumbnailUrl = result.secure_url;
    thumbnailPublicId = result.public_id;
  }

  const publication = await Publication.create({
    title,
    description,
    pdfUrl,
    pdfPath,
    thumbnailUrl,
    thumbnailPublicId,
    category: category || 'other',
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
    publishedAt: publishedAt || Date.now(),
    uploadedBy: req.user.id
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
  const publication = await Publication.findById(req.params.id);
  if (!publication) {
    return next(new AppError('No publication found with that ID', 404));
  }

  const { title, description, category, tags, publishedAt } = req.body;

  // Update text fields
  if (title) publication.title = title;
  if (description) publication.description = description;
  if (category) publication.category = category;
  if (tags) publication.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
  if (publishedAt) publication.publishedAt = publishedAt;

  // Replace PDF if provided
  if (req.files && req.files.pdf && req.files.pdf[0]) {
    // Delete old PDF from Supabase
    if (publication.pdfPath) {
      await deletePDF(publication.pdfPath);
    }
    const { pdfUrl, pdfPath } = await uploadPDF(
      req.files.pdf[0].buffer,
      req.files.pdf[0].originalname
    );
    publication.pdfUrl = pdfUrl;
    publication.pdfPath = pdfPath;
  }

  // Replace thumbnail if provided
  if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
    if (publication.thumbnailPublicId) {
      await cloudinary.uploader.destroy(publication.thumbnailPublicId);
    }
    const result = await uploadImageToCloudinary(
      req.files.thumbnail[0].buffer,
      'rte/publications'
    );
    publication.thumbnailUrl = result.secure_url;
    publication.thumbnailPublicId = result.public_id;
  }

  await publication.save();

  res.status(200).json({
    status: 'success',
    data: { publication }
  });
});

/**
 * DELETE /api/v1/publications/:id — Admin: delete a publication
 */
exports.deletePublication = catchAsync(async (req, res, next) => {
  const publication = await Publication.findById(req.params.id);
  if (!publication) {
    return next(new AppError('No publication found with that ID', 404));
  }

  // Delete PDF from Supabase
  if (publication.pdfPath) {
    await deletePDF(publication.pdfPath);
  }

  // Delete thumbnail from Cloudinary
  if (publication.thumbnailPublicId) {
    await cloudinary.uploader.destroy(publication.thumbnailPublicId);
  }

  await Publication.findByIdAndDelete(req.params.id);

  res.status(204).json({ status: 'success', data: null });
});
