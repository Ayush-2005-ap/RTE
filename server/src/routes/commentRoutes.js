const express = require('express');
const commentController = require('../controllers/commentController');
const authGuard = require('../middleware/authGuard');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Public routes — anyone can read and post comments
router.get('/', commentController.getComments);
router.post('/', commentController.createComment);

// Admin routes
router.use(authGuard);
router.use(roleCheck('admin', 'moderator'));

router.get('/all', commentController.getAllCommentsAdmin);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
