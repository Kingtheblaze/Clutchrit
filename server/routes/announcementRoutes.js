// server/routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const { getAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAnnouncements);
router.get('/:id', getAnnouncementById);
router.post('/', protect, adminOnly, createAnnouncement);
router.put('/:id', protect, adminOnly, updateAnnouncement);
router.delete('/:id', protect, adminOnly, deleteAnnouncement);

module.exports = router;
