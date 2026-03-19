const express = require('express');
const newsController = require('../controllers/newsController');
const authGuard = require('../middleware/authGuard');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNews);

// Admin routes (protected)
router.use(authGuard);
router.use(roleCheck('admin', 'moderator'));

router.post('/', upload.single('image'), newsController.createNews);
router.patch('/:id', upload.single('image'), newsController.updateNews);
router.delete('/:id', newsController.deleteNews);

module.exports = router;
