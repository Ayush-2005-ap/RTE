const Grievance = require('../models/Grievance');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/apiFeatures');
const uploadService = require('../services/uploadService');

/**
 * File a new grievance
 */
exports.createGrievance = catchAsync(async (req, res, next) => {
  // 1. Prepare data
  const { state, category, description, userType } = req.body;
  
  // 2. Handle file uploads if any
  const attachments = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file => 
      uploadService.uploadFromBuffer(file.buffer, 'rte-grievances')
    );
    
    const results = await Promise.all(uploadPromises);
    results.forEach((result, index) => {
      attachments.push({
        url: result.secure_url,
        publicId: result.public_id,
        filename: req.files[index].originalname
      });
    });
  }

  // 3. Create grievance
  const grievance = await Grievance.create({
    author: req.user.id,
    state,
    category,
    description,
    userType: userType || req.user.userType,
    attachments
  });

  res.status(201).json({
    status: 'success',
    data: {
      grievance
    }
  });
});

/**
 * Get all grievances for current user
 */
exports.getMyGrievances = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Grievance.find({ author: req.user.id }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const grievances = await features.query;

  res.status(200).json({
    status: 'success',
    results: grievances.length,
    data: {
      grievances
    }
  });
});

/**
 * Get single grievance details
 */
exports.getGrievance = catchAsync(async (req, res, next) => {
  const grievance = await Grievance.findById(req.params.id)
    .populate('author', 'name email state')
    .populate('adminNotes.addedBy', 'name role');

  if (!grievance) {
    return next(new AppError('No grievance found with that ID', 404));
  }

  // Check ownership unless admin/moderator
  if (grievance.author.id !== req.user.id && !['admin', 'moderator'].includes(req.user.role)) {
    return next(new AppError('You do not have permission to view this grievance', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      grievance
    }
  });
});

/**
 * Update grievance status (Admins/Moderators)
 */
exports.updateGrievanceStatus = catchAsync(async (req, res, next) => {
  const { status, note } = req.body;

  const grievance = await Grievance.findById(req.params.id);

  if (!grievance) {
    return next(new AppError('No grievance found with that ID', 404));
  }

  if (status) grievance.status = status;
  
  if (note) {
    grievance.adminNotes.push({
      note,
      addedBy: req.user.id
    });
  }

  await grievance.save();

  res.status(200).json({
    status: 'success',
    data: {
      grievance
    }
  });
});

/**
 * Get all grievances (Admin only)
 */
exports.getAllGrievances = catchAsync(async (req, res, next) => {
  const query = Grievance.find().populate('author', 'name email');
  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const grievances = await features.query;

  res.status(200).json({
    status: 'success',
    results: grievances.length,
    data: {
      grievances
    }
  });
});
