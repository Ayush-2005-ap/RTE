const express = require('express');
const questionController = require('../controllers/questionController');
const authGuard = require('../middleware/authGuard');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Public routes — no login needed
router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestion);
router.post('/', questionController.createQuestion);
router.post('/:id/answers', questionController.createAnswer);
router.post('/:id/upvote', questionController.upvoteQuestion);
router.post('/answers/:id/upvote', questionController.upvoteAnswer);

// Admin routes (protected)
router.use(authGuard);
router.use(roleCheck('admin', 'moderator'));

router.delete('/:id', questionController.deleteQuestion);
router.delete('/answers/:id', questionController.deleteAnswer);
router.patch('/answers/:id/verify', questionController.toggleAnswerVerification);

module.exports = router;
