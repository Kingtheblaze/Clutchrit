// server/routes/inviteRoutes.js
const express = require('express');
const router = express.Router();
const { sendInvite } = require('../controllers/inviteController');
const { protect, admin } = require('../middleware/authMiddleware');

// Only admins can send invites
router.post('/send', protect, admin, sendInvite);

module.exports = router;
