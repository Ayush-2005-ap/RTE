const express = require('express');
const sliderController = require('../controllers/sliderController');
const authGuard = require('../middleware/authGuard');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public route — fetch active slides for landing page
router.get('/', sliderController.getAllSlides);

// Admin routes (protected)
router.use(authGuard);
router.use(roleCheck('admin', 'moderator'));

router.get('/all', sliderController.getAllSlidesAdmin);
router.post('/', upload.single('image'), sliderController.createSlide);
router.patch('/reorder', sliderController.reorderSlides);
router.patch('/:id', upload.single('image'), sliderController.updateSlide);
router.delete('/:id', sliderController.deleteSlide);

module.exports = router;
