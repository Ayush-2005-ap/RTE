const express = require('express');
const landingBookController = require('../controllers/landingBookController');
const authGuard = require('../middleware/authGuard');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.get('/', landingBookController.getBookContent);

router.use(authGuard);
router.use(roleCheck('admin', 'moderator'));

router.post('/', landingBookController.createBookChapter);
router.patch('/reorder', landingBookController.reorderBookChapters);
router.patch('/:id', landingBookController.updateBookChapter);
router.delete('/:id', landingBookController.deleteBookChapter);

module.exports = router;
