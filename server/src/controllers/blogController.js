const BlogPost = require('../models/BlogPost');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const cloudinary = require('../config/cloudinary');
const slugify = require('slugify');
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
 * GET /api/v1/blog — Public: list published blog posts
 */
exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const filter = { status: 'published' };

  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.featured === 'true') filter.isFeatured = true;
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { excerpt: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const options = {
    page,
    limit,
    sort: { publishedAt: -1 },
    populate: { path: 'author', select: 'name' },
    select: '-body'  // Exclude full body from list view for performance
  };

  const result = await BlogPost.paginate(filter, options);

  res.status(200).json({
    status: 'success',
    data: {
      blogs: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      total: result.totalDocs
    }
  });
});

/**
 * GET /api/v1/blog/admin — Admin: list ALL blog posts (drafts + published)
 */
exports.getAllBlogsAdmin = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const result = await BlogPost.paginate({}, {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: { path: 'author', select: 'name' },
    select: '-body'
  });

  res.status(200).json({
    status: 'success',
    data: {
      blogs: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      total: result.totalDocs
    }
  });
});

/**
 * GET /api/v1/blog/:slug — Public: get single blog post by slug
 */
exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findOne({ slug: req.params.slug })
    .populate('author', 'name');

  if (!blog) {
    return next(new AppError('No blog post found with that slug', 404));
  }

  // Increment view count
  await BlogPost.findByIdAndUpdate(blog._id, { $inc: { viewCount: 1 } });

  res.status(200).json({
    status: 'success',
    data: { blog }
  });
});

/**
 * POST /api/v1/blog — Admin: create a blog post
 */
exports.createBlog = catchAsync(async (req, res, next) => {
  const { title, body, excerpt, tags, isFeatured, status } = req.body;

  // Generate unique slug
  let slug = slugify(title, { lower: true, strict: true });
  const existing = await BlogPost.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  let featuredImage;
  if (req.file) {
    const result = await uploadImageToCloudinary(req.file.buffer, 'rte/blog');
    featuredImage = {
      url: result.secure_url,
      publicId: result.public_id
    };
  }

  const blog = await BlogPost.create({
    title,
    slug,
    body,
    excerpt,
    featuredImage,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
    isFeatured: isFeatured === 'true' || isFeatured === true,
    status: status || 'draft',
    publishedAt: status === 'published' ? Date.now() : undefined,
    author: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: { blog }
  });
});

/**
 * PATCH /api/v1/blog/:id — Admin: update a blog post
 */
exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id);
  if (!blog) {
    return next(new AppError('No blog post found with that ID', 404));
  }

  const { title, body, excerpt, tags, isFeatured, status } = req.body;

  if (title !== undefined) blog.title = title;
  if (body !== undefined) blog.body = body;
  if (excerpt !== undefined) blog.excerpt = excerpt;
  if (tags !== undefined) blog.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
  if (isFeatured !== undefined) blog.isFeatured = isFeatured === 'true' || isFeatured === true;

  // Handle status change — set publishedAt when first published
  if (status !== undefined && status !== blog.status) {
    blog.status = status;
    if (status === 'published' && !blog.publishedAt) {
      blog.publishedAt = Date.now();
    }
  }

  if (req.file) {
    if (blog.featuredImage && blog.featuredImage.publicId) {
      await cloudinary.uploader.destroy(blog.featuredImage.publicId);
    }
    const result = await uploadImageToCloudinary(req.file.buffer, 'rte/blog');
    blog.featuredImage = {
      url: result.secure_url,
      publicId: result.public_id
    };
  }

  await blog.save();

  res.status(200).json({
    status: 'success',
    data: { blog }
  });
});

/**
 * DELETE /api/v1/blog/:id — Admin: delete a blog post
 */
exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id);
  if (!blog) {
    return next(new AppError('No blog post found with that ID', 404));
  }

  if (blog.featuredImage && blog.featuredImage.publicId) {
    await cloudinary.uploader.destroy(blog.featuredImage.publicId);
  }

  await BlogPost.findByIdAndDelete(req.params.id);

  res.status(204).json({ status: 'success', data: null });
});
