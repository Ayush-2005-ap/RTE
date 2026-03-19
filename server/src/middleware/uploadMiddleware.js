const multer = require('multer');
const AppError = require('../utils/AppError');

// Use memory storage to get buffers for Cloudinary streams
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  if (file.mimetype.startsWith('image') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new AppError('Only images and PDFs are allowed!', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for PDFs and images
  }
});

module.exports = upload;
