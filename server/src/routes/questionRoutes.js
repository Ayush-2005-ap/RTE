const express = require('express');
const questionController = require('../controllers/questionController');
const authGuard = require('../middleware/authGuard');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Public routes
router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestion);

// Protected routes
router.use(authGuard);

router.post('/', questionController.createQuestion);
router.post('/:id/answers', questionController.createAnswer);
router.post('/:id/vote', questionController.toggleQuestionVote);

// Admin/Moderator routes
router.patch('/answers/:id/verify', roleCheck('admin', 'moderator'), questionController.toggleAnswerVerification);

module.exports = router;
