const Question = require('../models/Question');
const Answer = require('../models/Answer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/apiFeatures');

/**
 * Get all questions
 */
exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Question.find().populate('author', 'name userType'), 
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const questions = await features.query;

  res.status(200).json({
    status: 'success',
    results: questions.length,
    data: {
      questions
    }
  });
});

/**
 * Get single question with answers
 */
exports.getQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id)
    .populate('author', 'name userType state');

  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  // Increment view count
  question.views += 1;
  await question.save({ validateBeforeSave: false });

  const answers = await Answer.find({ questionId: req.params.id })
    .populate('author', 'name userType role')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: {
      question,
      answers
    }
  });
});

/**
 * Ask a new question
 */
exports.createQuestion = catchAsync(async (req, res, next) => {
  const { title, body, state, category, tags } = req.body;

  const question = await Question.create({
    title,
    body,
    state: state || 'All India',
    category,
    tags,
    author: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: {
      question
    }
  });
});

/**
 * Answer a question
 */
exports.createAnswer = catchAsync(async (req, res, next) => {
  const { body } = req.body;
  const questionId = req.params.id;

  const question = await Question.findById(questionId);
  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  const answer = await Answer.create({
    body,
    questionId,
    author: req.user.id
  });

  // Update question answer count
  question.answerCount += 1;
  if (question.status === 'open') {
    question.status = 'answered';
  }
  await question.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    data: {
      answer
    }
  });
});

/**
 * Upvote a question
 */
exports.toggleQuestionVote = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  const index = question.upvotes.indexOf(req.user.id);
  
  if (index === -1) {
    // Vote up
    question.upvotes.push(req.user.id);
  } else {
    // Remove vote
    question.upvotes.splice(index, 1);
  }

  await question.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      upvotes: question.upvotes.length
    }
  });
});

/**
 * Toggle verification for an answer (Admins/Moderators)
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
    data: {
      answer
    }
  });
});
