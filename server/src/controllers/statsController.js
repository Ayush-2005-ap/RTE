const User = require('../models/User');
const Question = require('../models/Question');
const Grievance = require('../models/Grievance');
const catchAsync = require('../utils/catchAsync');

/**
 * Get public stats for homepage
 */
exports.getPublicStats = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalQuestions = await Question.countDocuments();
  const totalGrievances = await Grievance.countDocuments({ status: 'resolved' });

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalUsers,
        totalQuestions,
        resolvedGrievances: totalGrievances
      }
    }
  });
});

/**
 * Get detailed stats for Admin Dashboard
 */
exports.getAdminStats = catchAsync(async (req, res, next) => {
  // 1. Basic counts
  const totalUsers = await User.countDocuments();
  const totalQuestions = await Question.countDocuments();
  const totalGrievances = await Grievance.countDocuments();
  const resolvedGrievances = await Grievance.countDocuments({ status: 'resolved' });

  // 2. Growth stats (this week)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const usersThisWeek = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });
  const questionsThisWeek = await Question.countDocuments({ createdAt: { $gte: oneWeekAgo } });
  const grievancesThisWeek = await Grievance.countDocuments({ createdAt: { $gte: oneWeekAgo } });

  // 3. Recent activity
  const recentGrievances = await Grievance.find()
    .sort('-createdAt')
    .limit(5)
    .select('refNumber category state status createdAt');

  res.status(200).json({
    status: 'success',
    data: {
      summary: {
        totalUsers,
        totalQuestions,
        totalGrievances,
        resolvedGrievances,
        resolutionRate: totalGrievances > 0 ? Math.round((resolvedGrievances / totalGrievances) * 100) : 0
      },
      growth: {
        usersThisWeek,
        questionsThisWeek,
        grievancesThisWeek
      },
      recentGrievances
    }
  });
});
