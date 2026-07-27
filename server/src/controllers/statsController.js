const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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
    prisma.user.count(),
    prisma.user.count({ where: { role: { in: ['admin', 'moderator'] } } }),
    prisma.question.count(),
    prisma.news.count(),
    prisma.blogPost.count({ where: { status: 'published' } }),
    prisma.publication.count(),
    prisma.comment.count(),
    
    prisma.user.count({ where: { createdAt: { gte: oneWeekAgo } } }),
    prisma.question.count({ where: { createdAt: { gte: oneWeekAgo } } }),
    prisma.news.count({ where: { createdAt: { gte: oneWeekAgo } } }),
    prisma.blogPost.count({ where: { createdAt: { gte: oneWeekAgo } } }),
    
    prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        title: true,
        status: true,
        createdAt: true,
        author: { select: { name: true } }
      }
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        body: true,
        createdAt: true,
        author: { select: { name: true } }
      }
    })
  ]);

  // Format recent questions and comments to match the previous Mongoose response structure if possible
  const formattedRecentQuestions = recentQuestions.map(q => ({
    title: q.title,
    status: q.status,
    createdAt: q.createdAt,
    authorName: q.author ? q.author.name : 'Unknown'
  }));

  const formattedRecentComments = recentComments.map(c => ({
    body: c.body,
    createdAt: c.createdAt,
    authorName: c.author ? c.author.name : 'Unknown',
    contentType: 'Discussion' // Since comments are linked generically, default to Discussion or similar
  }));

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
        questions: formattedRecentQuestions,
        comments: formattedRecentComments
      }
    }
  });
});
