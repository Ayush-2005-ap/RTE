const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const uploadService = require('../services/uploadService');

/**
 * File a new grievance
 */
exports.createGrievance = catchAsync(async (req, res, next) => {
  // 1. Prepare data
  const { state, category, description, userType } = req.body;
  
  // 2. Handle file uploads if any
  const attachmentsData = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file => 
      uploadService.uploadFromBuffer(file.buffer, 'rte-grievances', file.mimetype)
    );
    
    const results = await Promise.all(uploadPromises);
    results.forEach((result, index) => {
      attachmentsData.push({
        url: result.secure_url,
        publicId: result.public_id,
        filename: req.files[index].originalname
      });
    });
  }

  // Generate unique ref number
  const refNumber = `RTE-${Math.floor(100000 + Math.random() * 900000)}`;

  // 3. Create grievance
  const grievance = await prisma.grievance.create({
    data: {
      refNumber,
      authorId: req.user.id,
      state,
      category,
      description,
      userType: userType || req.user.userType || 'citizen',
      attachments: {
        create: attachmentsData
      }
    },
    include: { attachments: true }
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { authorId: req.user.id };

  const [grievances, total] = await Promise.all([
    prisma.grievance.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { attachments: true }
    }),
    prisma.grievance.count({ where: filter })
  ]);

  res.status(200).json({
    status: 'success',
    results: grievances.length,
    data: {
      grievances,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  });
});

/**
 * Get single grievance details
 */
exports.getGrievance = catchAsync(async (req, res, next) => {
  const grievance = await prisma.grievance.findUnique({
    where: { id: req.params.id },
    include: {
      author: { select: { id: true, name: true, email: true, state: true } },
      attachments: true,
      adminNotes: {
        include: { addedBy: { select: { name: true, role: true } } },
        orderBy: { addedAt: 'asc' }
      }
    }
  });

  if (!grievance) {
    return next(new AppError('No grievance found with that ID', 404));
  }

  // Check ownership unless admin/moderator
  if (grievance.authorId !== req.user.id && !['admin', 'moderator'].includes(req.user.role)) {
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

  const existing = await prisma.grievance.findUnique({ where: { id: req.params.id } });

  if (!existing) {
    return next(new AppError('No grievance found with that ID', 404));
  }

  const updateData = {};
  if (status) updateData.status = status;

  if (note) {
    updateData.adminNotes = {
      create: {
        note,
        addedById: req.user.id
      }
    };
  }

  const grievance = await prisma.grievance.update({
    where: { id: req.params.id },
    data: updateData,
    include: {
      adminNotes: {
        include: { addedBy: { select: { name: true, role: true } } }
      }
    }
  });

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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [grievances, total] = await Promise.all([
    prisma.grievance.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, email: true } } }
    }),
    prisma.grievance.count({ where: filter })
  ]);

  res.status(200).json({
    status: 'success',
    results: grievances.length,
    data: {
      grievances,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  });
});
