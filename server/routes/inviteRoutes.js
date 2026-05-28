// server/routes/inviteRoutes.js
const express = require('express');
const router = express.Router();
const { sendInvite } = require('../controllers/inviteController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Only admins can send invites
router.post('/send', protect, adminOnly, sendInvite);

module.exports = router;
