const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/globalErrorHandler');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      if (origin === process.env.CLIENT_URL) {
        return callback(null, true);
      }
      callback(null, false);
    },
    credentials: true,
  })
);

// Body parser — increase limit for rich text blog posts
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(cookieParser());

// Prevent parameter pollution
app.use(hpp());

app.use(compression());

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: Date.now(),
  });
});

// 2) ROUTES
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');
const stateRoutes = require('./routes/stateRoutes');
const newsRoutes = require('./routes/newsRoutes');
const blogRoutes = require('./routes/blogRoutes');
const publicationRoutes = require('./routes/publicationRoutes');
const sliderRoutes = require('./routes/sliderRoutes');
const commentRoutes = require('./routes/commentRoutes');
const statsRoutes = require('./routes/statsRoutes');
const landingBookRoutes = require('./routes/landingBookRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/states', stateRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/publications', publicationRoutes);
app.use('/api/v1/slider', sliderRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/book', landingBookRoutes);

// Handle undefined routes
app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
