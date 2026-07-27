const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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
    filter.OR = [
      { title: { contains: req.query.search, mode: 'insensitive' } },
      { body: { contains: req.query.search, mode: 'insensitive' } }
    ];
  }

  let orderBy = { createdAt: 'desc' };
  if (req.query.sort === 'popular') orderBy = { upvoteCount: 'desc' };
  if (req.query.sort === 'unanswered') {
    filter.status = 'open';
    filter.answerCount = 0;
  }

  const skip = (page - 1) * limit;

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy
    }),
    prisma.question.count({ where: filter })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  });
});

/**
 * GET /api/v1/questions/:id — Public: get single question with answers
 */
exports.getQuestion = catchAsync(async (req, res, next) => {
  const question = await prisma.question.findUnique({ where: { id: req.params.id } });
  
  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  // Increment view count
  await prisma.question.update({
    where: { id: req.params.id },
    data: { views: { increment: 1 } }
  });
  question.views += 1;

  const answers = await prisma.answer.findMany({
    where: { questionId: req.params.id },
    orderBy: { createdAt: 'desc' }
  });

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

  const question = await prisma.question.create({
    data: {
      title,
      body,
      authorName: authorName || 'Anonymous',
      state: state || 'All India',
      category: category || 'other',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : []
    }
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

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  const answer = await prisma.answer.create({
    data: {
      body,
      questionId,
      authorName: authorName || 'Anonymous'
    }
  });

  // Update question answer count and status
  const updateData = { answerCount: { increment: 1 } };
  if (question.status === 'open') updateData.status = 'answered';
  
  await prisma.question.update({
    where: { id: questionId },
    data: updateData
  });

  res.status(201).json({
    status: 'success',
    data: { answer }
  });
});

/**
 * POST /api/v1/questions/:id/upvote — Public: upvote a question
 */
exports.upvoteQuestion = catchAsync(async (req, res, next) => {
  const question = await prisma.question.update({
    where: { id: req.params.id },
    data: { upvoteCount: { increment: 1 } }
  }).catch(() => null);

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
  const answer = await prisma.answer.update({
    where: { id: req.params.id },
    data: { upvoteCount: { increment: 1 } }
  }).catch(() => null);

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
  const question = await prisma.question.findUnique({ where: { id: req.params.id } });
  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  // Delete all related answers (Prisma handles cascading if configured, but let's be explicit if not)
  await prisma.answer.deleteMany({ where: { questionId: req.params.id } });
  await prisma.question.delete({ where: { id: req.params.id } });

  res.status(204).json({ status: 'success', data: null });
});

/**
 * DELETE /api/v1/questions/answers/:id — Admin: delete a single answer
 */
exports.deleteAnswer = catchAsync(async (req, res, next) => {
  const answer = await prisma.answer.findUnique({ where: { id: req.params.id } });
  if (!answer) {
    return next(new AppError('No answer found with that ID', 404));
  }

  // Decrement question answer count
  await prisma.question.update({
    where: { id: answer.questionId },
    data: { answerCount: { decrement: 1 } }
  });

  await prisma.answer.delete({ where: { id: req.params.id } });

  res.status(204).json({ status: 'success', data: null });
});

/**
 * PATCH /api/v1/questions/answers/:id/verify — Admin: mark answer as verified
 */
exports.toggleAnswerVerification = catchAsync(async (req, res, next) => {
  const existing = await prisma.answer.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    return next(new AppError('No answer found with that ID', 404));
  }

  const answer = await prisma.answer.update({
    where: { id: req.params.id },
    data: { isVerified: !existing.isVerified }
  });

  res.status(200).json({
    status: 'success',
    data: { answer }
  });
});
