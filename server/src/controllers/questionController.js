const Question = require('../models/Question');
const Answer = require('../models/Answer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

/**
 * GET /api/v1/questions — Public: get all questions
 */
exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filter = {};

  if (req.query.state) filter.state = req.query.state;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { body: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  let sort = { createdAt: -1 };
  if (req.query.sort === 'popular') sort = { upvoteCount: -1 };
  if (req.query.sort === 'unanswered') {
    filter.status = 'open';
    filter.answerCount = 0;
  }

  const result = await Question.paginate(filter, { page, limit, sort });

  res.status(200).json({
    status: 'success',
    data: {
      questions: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      total: result.totalDocs
    }
  });
});

/**
 * GET /api/v1/questions/:id — Public: get single question with answers
 */
exports.getQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  // Increment view count
  await Question.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  const answers = await Answer.find({ questionId: req.params.id }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: { question, answers }
  });
});

/**
 * POST /api/v1/questions — Public: ask a question (no login needed)
 */
exports.createQuestion = catchAsync(async (req, res, next) => {
  const { title, body, authorName, state, category, tags } = req.body;

  const question = await Question.create({
    title,
    body,
    authorName: authorName || 'Anonymous',
    state: state || 'All India',
    category,
    tags: tags || []
  });

  res.status(201).json({
    status: 'success',
    data: { question }
  });
});

/**
 * POST /api/v1/questions/:id/answers — Public: answer a question (no login needed)
 */
exports.createAnswer = catchAsync(async (req, res, next) => {
  const { body, authorName } = req.body;
  const questionId = req.params.id;

  const question = await Question.findById(questionId);
  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  const answer = await Answer.create({
    body,
    questionId,
    authorName: authorName || 'Anonymous'
  });

  // Update question answer count and status
  question.answerCount += 1;
  if (question.status === 'open') question.status = 'answered';
  await question.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    data: { answer }
  });
});

/**
 * POST /api/v1/questions/:id/upvote — Public: upvote a question
 */
exports.upvoteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(
    req.params.id,
    { $inc: { upvoteCount: 1 } },
    { new: true }
  );

  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { upvoteCount: question.upvoteCount }
  });
});

/**
 * POST /api/v1/questions/answers/:id/upvote — Public: upvote an answer
 */
exports.upvoteAnswer = catchAsync(async (req, res, next) => {
  const answer = await Answer.findByIdAndUpdate(
    req.params.id,
    { $inc: { upvoteCount: 1 } },
    { new: true }
  );

  if (!answer) {
    return next(new AppError('No answer found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { upvoteCount: answer.upvoteCount }
  });
});

/**
 * DELETE /api/v1/questions/:id — Admin: delete a question (and its answers)
 */
exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  // Delete all related answers
  await Answer.deleteMany({ questionId: req.params.id });
  await Question.findByIdAndDelete(req.params.id);

  res.status(204).json({ status: 'success', data: null });
});

/**
 * DELETE /api/v1/questions/answers/:id — Admin: delete a single answer
 */
exports.deleteAnswer = catchAsync(async (req, res, next) => {
  const answer = await Answer.findById(req.params.id);
  if (!answer) {
    return next(new AppError('No answer found with that ID', 404));
  }

  // Decrement question answer count
  await Question.findByIdAndUpdate(answer.questionId, {
    $inc: { answerCount: -1 }
  });

  await Answer.findByIdAndDelete(req.params.id);

  res.status(204).json({ status: 'success', data: null });
});

/**
 * PATCH /api/v1/questions/answers/:id/verify — Admin: mark answer as verified
 */
exports.toggleAnswerVerification = catchAsync(async (req, res, next) => {
  const answer = await Answer.findById(req.params.id);
  if (!answer) {
    return next(new AppError('No answer found with that ID', 404));
  }

  answer.isVerified = !answer.isVerified;
  await answer.save();

  res.status(200).json({
    status: 'success',
    data: { answer }
  });
});
