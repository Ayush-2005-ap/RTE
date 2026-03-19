const News = require('../models/News');
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
 * GET /api/v1/news — Public: list news with pagination & filters
 */
exports.getAllNews = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const filter = {};

  if (req.query.state) filter.state = req.query.state;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { summary: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const options = {
    page,
    limit,
    sort: { publishedAt: -1 },
    populate: { path: 'addedBy', select: 'name' }
  };

  const result = await News.paginate(filter, options);

  res.status(200).json({
    status: 'success',
    data: {
      news: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      total: result.totalDocs
    }
  });
});

/**
 * GET /api/v1/news/:id — Public: get single news item
 */
exports.getNews = catchAsync(async (req, res, next) => {
  const news = await News.findById(req.params.id).populate('addedBy', 'name');
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

  let imageUrl, imagePublicId;
  if (req.file) {
    const result = await uploadImageToCloudinary(req.file.buffer, 'rte/news');
    imageUrl = result.secure_url;
    imagePublicId = result.public_id;
  }

  const news = await News.create({
    title,
    summary,
    body,
    source,
    sourceUrl,
    imageUrl,
    imagePublicId,
    state: state || 'All India',
    category: category || 'other',
    publishedAt: publishedAt || Date.now(),
    addedBy: req.user.id
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
  const news = await News.findById(req.params.id);
  if (!news) {
    return next(new AppError('No news item found with that ID', 404));
  }

  const { title, summary, body, source, sourceUrl, state, category, publishedAt } = req.body;

  if (title !== undefined) news.title = title;
  if (summary !== undefined) news.summary = summary;
  if (body !== undefined) news.body = body;
  if (source !== undefined) news.source = source;
  if (sourceUrl !== undefined) news.sourceUrl = sourceUrl;
  if (state !== undefined) news.state = state;
  if (category !== undefined) news.category = category;
  if (publishedAt !== undefined) news.publishedAt = publishedAt;

  if (req.file) {
    if (news.imagePublicId) {
      await cloudinary.uploader.destroy(news.imagePublicId);
    }
    const result = await uploadImageToCloudinary(req.file.buffer, 'rte/news');
    news.imageUrl = result.secure_url;
    news.imagePublicId = result.public_id;
  }

  await news.save();

  res.status(200).json({
    status: 'success',
    data: { news }
  });
});

/**
 * DELETE /api/v1/news/:id — Admin: delete a news item
 */
exports.deleteNews = catchAsync(async (req, res, next) => {
  const news = await News.findById(req.params.id);
  if (!news) {
    return next(new AppError('No news item found with that ID', 404));
  }

  if (news.imagePublicId) {
    await cloudinary.uploader.destroy(news.imagePublicId);
  }

  await News.findByIdAndDelete(req.params.id);

  res.status(204).json({ status: 'success', data: null });
});
