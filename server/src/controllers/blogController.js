const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { uploadFromBuffer, deleteFromCloudinary } = require('../services/uploadService');
const slugify = require('slugify');

/**
 * GET /api/v1/blog — Public: list published blog posts
 */
exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const filter = { status: 'published' };

  if (req.query.tag) filter.tags = { has: req.query.tag };
  if (req.query.featured === 'true') filter.isFeatured = true;
  if (req.query.search) {
    filter.OR = [
      { title: { contains: req.query.search, mode: 'insensitive' } },
      { excerpt: { contains: req.query.search, mode: 'insensitive' } }
    ];
  }

  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { author: { select: { name: true } } },
      // Exclude full body from list view is not natively supported by Prisma without specifying all other fields, 
      // but we can omit 'body' from selection if we list out other fields. Since Prisma returns everything by default, 
      // let's map over results to remove `body`.
    }),
    prisma.blogPost.count({ where: filter })
  ]);

  const sanitizedBlogs = blogs.map(b => {
    const { body, ...rest } = b;
    return rest;
  });

  res.status(200).json({
    status: 'success',
    data: {
      blogs: sanitizedBlogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  });
});

/**
 * GET /api/v1/blog/admin — Admin: list ALL blog posts (drafts + published)
 */
exports.getAllBlogsAdmin = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    prisma.blogPost.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } }
    }),
    prisma.blogPost.count()
  ]);

  const sanitizedBlogs = blogs.map(b => {
    const { body, ...rest } = b;
    return rest;
  });

  res.status(200).json({
    status: 'success',
    data: {
      blogs: sanitizedBlogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  });
});

/**
 * GET /api/v1/blog/:slug — Public: get single blog post by slug
 */
exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await prisma.blogPost.findUnique({
    where: { slug: req.params.slug },
    include: { author: { select: { name: true } } }
  });

  if (!blog) {
    return next(new AppError('No blog post found with that slug', 404));
  }

  // Increment view count
  await prisma.blogPost.update({
    where: { id: blog.id },
    data: { viewCount: { increment: 1 } }
  });

  blog.viewCount += 1;

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

  let slug = slugify(title, { lower: true, strict: true });
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  let featuredImageUrl = null;
  let featuredImageId = null;

  if (req.file) {
    const result = await uploadFromBuffer(req.file.buffer, 'rte/blog');
    featuredImageUrl = result.secure_url;
    featuredImageId = result.public_id;
  }

  const blog = await prisma.blogPost.create({
    data: {
      title,
      slug,
      body,
      excerpt,
      featuredImageUrl,
      featuredImageId,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      isFeatured: isFeatured === 'true' || isFeatured === true,
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null,
      authorId: req.user.id
    },
    include: { author: { select: { name: true } } }
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
  const existingBlog = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  
  if (!existingBlog) {
    return next(new AppError('No blog post found with that ID', 404));
  }

  const { title, body, excerpt, tags, isFeatured, status } = req.body;
  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (body !== undefined) updateData.body = body;
  if (excerpt !== undefined) updateData.excerpt = excerpt;
  if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
  if (isFeatured !== undefined) updateData.isFeatured = isFeatured === 'true' || isFeatured === true;

  if (status !== undefined && status !== existingBlog.status) {
    updateData.status = status;
    if (status === 'published' && !existingBlog.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  if (req.file) {
    if (existingBlog.featuredImageId) {
      await deleteFromCloudinary(existingBlog.featuredImageId);
    }
    const result = await uploadFromBuffer(req.file.buffer, 'rte/blog');
    updateData.featuredImageUrl = result.secure_url;
    updateData.featuredImageId = result.public_id;
  }

  const blog = await prisma.blogPost.update({
    where: { id: req.params.id },
    data: updateData,
    include: { author: { select: { name: true } } }
  });

  res.status(200).json({
    status: 'success',
    data: { blog }
  });
});

/**
 * DELETE /api/v1/blog/:id — Admin: delete a blog post
 */
exports.deleteBlog = catchAsync(async (req, res, next) => {
  const existingBlog = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  
  if (!existingBlog) {
    return next(new AppError('No blog post found with that ID', 404));
  }

  if (existingBlog.featuredImageId) {
    await deleteFromCloudinary(existingBlog.featuredImageId);
  }

  await prisma.blogPost.delete({ where: { id: req.params.id } });

  res.status(204).json({ status: 'success', data: null });
});
