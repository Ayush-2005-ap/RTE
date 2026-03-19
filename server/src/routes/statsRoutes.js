const express = require('express');
const statsController = require('../controllers/statsController');
const authGuard = require('../middleware/authGuard');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Admin dashboard stats (protected)
router.get('/admin', authGuard, roleCheck('admin', 'moderator'), statsController.getAdminStats);

module.exports = router;
