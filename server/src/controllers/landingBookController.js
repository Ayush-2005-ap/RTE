const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Public route to get all book content in order
exports.getBookContent = catchAsync(async (req, res, next) => {
  const content = await prisma.landingBook.findMany({
    orderBy: { order: 'asc' }
  });
  
  res.status(200).json({
    status: 'success',
    data: { content }
  });
});

// Admin ONLY methods
exports.createBookChapter = catchAsync(async (req, res, next) => {
  const { order, type, title, desc, items } = req.body;
  
  const newChapter = await prisma.landingBook.create({
    data: {
      order: order !== undefined ? parseInt(order) : 0,
      type,
      title,
      desc,
      items: Array.isArray(items) ? items : (items ? [items] : [])
    }
  });
  
  res.status(201).json({
    status: 'success',
    data: { chapter: newChapter }
  });
});

exports.updateBookChapter = catchAsync(async (req, res, next) => {
  const { order, type, title, desc, items } = req.body;
  const updateData = {};
  
  if (order !== undefined) updateData.order = parseInt(order);
  if (type !== undefined) updateData.type = type;
  if (title !== undefined) updateData.title = title;
  if (desc !== undefined) updateData.desc = desc;
  if (items !== undefined) updateData.items = Array.isArray(items) ? items : (items ? [items] : []);

  const chapter = await prisma.landingBook.update({
    where: { id: req.params.id },
    data: updateData
  }).catch(() => null);
  
  if (!chapter) return next(new AppError('No chapter found with that ID', 404));
  
  res.status(200).json({
    status: 'success',
    data: { chapter }
  });
});

exports.deleteBookChapter = catchAsync(async (req, res, next) => {
  const chapter = await prisma.landingBook.delete({
    where: { id: req.params.id }
  }).catch(() => null);
  
  if (!chapter) return next(new AppError('No chapter found with that ID', 404));
  
  res.status(204).json({ status: 'success', data: null });
});

// Update the order of multiple chapters at once
exports.reorderBookChapters = catchAsync(async (req, res, next) => {
  const { chapters } = req.body; // Array of { id, order }
  
  if (!chapters || !Array.isArray(chapters)) {
    return next(new AppError('Please provide an array of chapters to reorder', 400));
  }
  
  await prisma.$transaction(
    chapters.map(item => 
      prisma.landingBook.update({
        where: { id: item.id },
        data: { order: parseInt(item.order) }
      })
    )
  );
  
  res.status(200).json({ status: 'success', message: 'Chapters reordered successfully' });
});
