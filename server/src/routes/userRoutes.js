const express = require('express');
const userController = require('../controllers/userController');
const authGuard = require('../middleware/authGuard');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// All user management routes require admin access
router.use(authGuard);
router.use(roleCheck('admin'));

router.get('/admins', userController.getAdminUsers);
router.post('/admins', userController.createAdminUser);
router.patch('/admins/:id', userController.updateAdminUser);
router.delete('/admins/:id', userController.deleteAdminUser);

module.exports = router;
