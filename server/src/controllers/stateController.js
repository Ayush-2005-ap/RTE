const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

/**
 * GET /api/v1/states — Public: get all states
 */
exports.getAllStates = catchAsync(async (req, res, next) => {
  const filter = {};

  if (req.query.region) filter.region = req.query.region;
  if (req.query.compliance) filter.complianceLabel = req.query.compliance;

  const states = await prisma.state.findMany({
    where: filter,
    orderBy: { name: 'asc' }
  });

  res.status(200).json({
    status: 'success',
    results: states.length,
    data: { states }
  });
});

/**
 * GET /api/v1/states/:slug — Public: get a single state
 */
exports.getState = catchAsync(async (req, res, next) => {
  const state = await prisma.state.findUnique({
    where: { slug: req.params.slug }
  });

  if (!state) {
    return next(new AppError('No state found with that identifier', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { state }
  });
});

/**
 * POST /api/v1/states — Admin: create a new state entry
 */
exports.createState = catchAsync(async (req, res, next) => {
  const { name, slug, region, complianceScore, complianceLabel, keyIssue, contactEmail } = req.body;

  const state = await prisma.state.create({
    data: {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      region,
      complianceScore: complianceScore ? parseInt(complianceScore) : undefined,
      complianceLabel,
      keyIssue,
      contactEmail,
      lastUpdated: new Date()
    }
  });

  res.status(201).json({
    status: 'success',
    data: { state }
  });
});

/**
 * PATCH /api/v1/states/:id — Admin: update a state's data
 */
exports.updateState = catchAsync(async (req, res, next) => {
  const existing = await prisma.state.findUnique({ where: { id: req.params.id } });
  
  if (!existing) {
    return next(new AppError('No state found with that ID', 404));
  }

  const { complianceScore, complianceLabel, keyIssue, contactEmail, region } = req.body;
  const updateData = { lastUpdated: new Date() };

  if (complianceScore !== undefined) updateData.complianceScore = parseInt(complianceScore);
  if (complianceLabel !== undefined) updateData.complianceLabel = complianceLabel;
  if (keyIssue !== undefined) updateData.keyIssue = keyIssue;
  if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
  if (region !== undefined) updateData.region = region;

  const state = await prisma.state.update({
    where: { id: req.params.id },
    data: updateData
  });

  res.status(200).json({
    status: 'success',
    data: { state }
  });
});

/**
 * DELETE /api/v1/states/:id — Admin: delete a state entry
 */
exports.deleteState = catchAsync(async (req, res, next) => {
  const state = await prisma.state.delete({
    where: { id: req.params.id }
  }).catch(() => null);

  if (!state) {
    return next(new AppError('No state found with that ID', 404));
  }

  res.status(204).json({ status: 'success', data: null });
});
