const express = require('express');
const publicationController = require('../controllers/publicationController');
const authGuard = require('../middleware/authGuard');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', publicationController.getAllPublications);
router.get('/:id', publicationController.getPublication);
router.get('/:id/download', publicationController.trackDownload);

// Admin routes (protected)
router.use(authGuard);
router.use(roleCheck('admin', 'moderator'));

// Accept both pdf and thumbnail files
router.post(
  '/',
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  publicationController.createPublication
);

router.patch(
  '/:id',
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  publicationController.updatePublication
);

router.delete('/:id', publicationController.deletePublication);

module.exports = router;
