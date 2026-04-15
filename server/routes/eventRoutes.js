// server/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, adminOnly, upload.single('bannerImage'), createEvent);
router.put('/:id', protect, adminOnly, upload.single('bannerImage'), updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
