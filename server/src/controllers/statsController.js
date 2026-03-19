const User = require('../models/User');
const Question = require('../models/Question');
const News = require('../models/News');
const BlogPost = require('../models/BlogPost');
const Publication = require('../models/Publication');
const Comment = require('../models/Comment');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/v1/stats/admin — Admin Dashboard Stats
 */
exports.getAdminStats = catchAsync(async (req, res, next) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [
    totalUsers,
    totalAdmins,
    totalQuestions,
    totalNews,
    totalBlogs,
    totalPublications,
    totalComments,
    usersThisWeek,
    questionsThisWeek,
    newsThisWeek,
    blogsThisWeek,
    recentQuestions,
    recentComments
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: { $in: ['admin', 'moderator'] } }),
    Question.countDocuments(),
    News.countDocuments(),
    BlogPost.countDocuments({ status: 'published' }),
    Publication.countDocuments(),
    Comment.countDocuments(),
    User.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
    Question.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
    News.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
    BlogPost.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
    Question.find().sort('-createdAt').limit(5).select('title authorName status createdAt'),
    Comment.find().sort('-createdAt').limit(5).select('contentType authorName body createdAt')
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      summary: {
        totalUsers,
        totalAdmins,
        totalQuestions,
        totalNews,
        totalBlogs,
        totalPublications,
        totalComments
      },
      growth: {
        usersThisWeek,
        questionsThisWeek,
        newsThisWeek,
        blogsThisWeek
      },
      recentActivity: {
        questions: recentQuestions,
        comments: recentComments
      }
    }
  });
});
