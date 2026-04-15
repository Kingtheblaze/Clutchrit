// server/routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const { getMembers, getMemberById, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getMembers);
router.get('/:id', getMemberById);
router.post('/', protect, adminOnly, upload.single('photo'), createMember);
router.put('/:id', protect, adminOnly, upload.single('photo'), updateMember);
router.delete('/:id', protect, adminOnly, deleteMember);

module.exports = router;
