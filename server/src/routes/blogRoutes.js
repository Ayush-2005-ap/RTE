const express = require('express');
const blogController = require('../controllers/blogController');
const authGuard = require('../middleware/authGuard');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:slug', blogController.getBlog);

// Admin routes (protected)
router.use(authGuard);
router.use(roleCheck('admin', 'moderator'));

router.get('/admin/all', blogController.getAllBlogsAdmin);
router.post('/', upload.single('image'), blogController.createBlog);
router.patch('/:id', upload.single('image'), blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
