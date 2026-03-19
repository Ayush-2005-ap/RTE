const State = require('../models/State');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

/**
 * GET /api/v1/states — Public: get all states
 */
exports.getAllStates = catchAsync(async (req, res, next) => {
  const filter = {};

  if (req.query.region) filter.region = req.query.region;
  if (req.query.compliance) filter.complianceLabel = req.query.compliance;

  const states = await State.find(filter).sort({ name: 1 });

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
  const state = await State.findOne({ slug: req.params.slug });

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

  const state = await State.create({
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    region,
    complianceScore,
    complianceLabel,
    keyIssue,
    contactEmail,
    lastUpdated: Date.now()
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
  const state = await State.findById(req.params.id);
  if (!state) {
    return next(new AppError('No state found with that ID', 404));
  }

  const { complianceScore, complianceLabel, keyIssue, contactEmail, region } = req.body;

  if (complianceScore !== undefined) state.complianceScore = complianceScore;
  if (complianceLabel !== undefined) state.complianceLabel = complianceLabel;
  if (keyIssue !== undefined) state.keyIssue = keyIssue;
  if (contactEmail !== undefined) state.contactEmail = contactEmail;
  if (region !== undefined) state.region = region;
  state.lastUpdated = Date.now();

  await state.save();

  res.status(200).json({
    status: 'success',
    data: { state }
  });
});

/**
 * DELETE /api/v1/states/:id — Admin: delete a state entry
 */
exports.deleteState = catchAsync(async (req, res, next) => {
  const state = await State.findById(req.params.id);
  if (!state) {
    return next(new AppError('No state found with that ID', 404));
  }

  await State.findByIdAndDelete(req.params.id);

  res.status(204).json({ status: 'success', data: null });
});
