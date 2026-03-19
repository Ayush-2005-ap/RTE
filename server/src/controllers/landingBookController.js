const LandingBook = require('../models/LandingBook');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Public route to get all book content in order
exports.getBookContent = catchAsync(async (req, res, next) => {
  const content = await LandingBook.find().sort('order');
  
  res.status(200).json({
    status: 'success',
    data: { content }
  });
});

// Admin ONLY methods
exports.createBookChapter = catchAsync(async (req, res, next) => {
  const newChapter = await LandingBook.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { chapter: newChapter }
  });
});

exports.updateBookChapter = catchAsync(async (req, res, next) => {
  const chapter = await LandingBook.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!chapter) return next(new AppError('No chapter found with that ID', 404));
  
  res.status(200).json({
    status: 'success',
    data: { chapter }
  });
});

exports.deleteBookChapter = catchAsync(async (req, res, next) => {
  const chapter = await LandingBook.findByIdAndDelete(req.params.id);
  
  if (!chapter) return next(new AppError('No chapter found with that ID', 404));
  
  res.status(204).json({ status: 'success', data: null });
});

// Update the order of multiple chapters at once
exports.reorderBookChapters = catchAsync(async (req, res, next) => {
  const { chapters } = req.body; // Array of { id, order }
  
  if (!chapters || !Array.isArray(chapters)) {
    return next(new AppError('Please provide an array of chapters to reorder', 400));
  }
  
  const updates = chapters.map(item => 
    LandingBook.findByIdAndUpdate(item.id, { order: item.order })
  );
  
  await Promise.all(updates);
  
  res.status(200).json({ status: 'success', message: 'Chapters reordered successfully' });
});
