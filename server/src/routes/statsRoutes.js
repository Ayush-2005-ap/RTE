const express = require('express');
const statsController = require('../controllers/statsController');
const authGuard = require('../middleware/authGuard');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Public stats
router.get('/', statsController.getPublicStats);

// Admin stats
router.get('/admin', authGuard, roleCheck('admin', 'moderator'), statsController.getAdminStats);

module.exports = router;
