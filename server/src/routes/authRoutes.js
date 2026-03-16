const express = require('express');
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const authGuard = require('../middleware/authGuard');

const router = express.Router();

router.post('/register', authController.register);
router.post('/verify-email/:token', authController.verifyEmail);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch('/update-password', authGuard, authController.updatePassword);

module.exports = router;
