const express = require('express');
const grievanceController = require('../controllers/grievanceController');
const authGuard = require('../middleware/authGuard');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authGuard);

router.route('/')
  .get(roleCheck('admin', 'moderator'), grievanceController.getAllGrievances)
  .post(upload.array('attachments', 5), grievanceController.createGrievance);

router.get('/my', grievanceController.getMyGrievances);

router.route('/:id')
  .get(grievanceController.getGrievance)
  .patch(roleCheck('admin', 'moderator'), grievanceController.updateGrievanceStatus);

module.exports = router;
