const express = require('express');
const router = express.Router();
const { createRoom, joinRoom, getMyRoom, getRoomMembers } = require('../controllers/roomController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createRoom);
router.post('/join', protect, joinRoom);
router.get('/my-room', protect, getMyRoom);
router.get('/members', protect, getRoomMembers);

module.exports = router;

