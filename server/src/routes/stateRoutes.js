const express = require('express');
const stateController = require('../controllers/stateController');
const authGuard = require('../middleware/authGuard');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Public routes
router.get('/', stateController.getAllStates);
router.get('/:slug', stateController.getState);

// Admin routes (protected)
router.use(authGuard);
router.use(roleCheck('admin', 'moderator'));

router.post('/', stateController.createState);
router.patch('/:id', stateController.updateState);
router.delete('/:id', stateController.deleteState);

module.exports = router;
