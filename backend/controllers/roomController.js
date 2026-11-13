const Room = require('../models/Room');
const User = require('../models/User');

// @desc    Create a new room
// @route   POST /api/rooms/create
exports.createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    let inviteCode = Room.generateInviteCode();
    // Ensure unique invite code
    let codeExists = await Room.findOne({ inviteCode });
    while (codeExists) {
      inviteCode = Room.generateInviteCode();
      codeExists = await Room.findOne({ inviteCode });
    }

    const room = await Room.create({
      name: name || 'Our Shared Room',
      inviteCode,
      members: [userId],
      createdBy: userId,
    });

    // Update user's roomId
    await User.findByIdAndUpdate(userId, { roomId: room._id });

    res.status(201).json({
      success: true,
      message: 'Room created successfully. Share invite code with your roommate.',
      data: room,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join an existing room using invite code
// @route   POST /api/rooms/join
exports.joinRoom = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user._id;

    if (!inviteCode) {
      return res.status(400).json({ success: false, message: 'Please enter a 6-digit room invite code.' });
    }

    const room = await Room.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Invalid room invite code. No room found.' });
    }

    // Check if user is already in this room
    if (room.members.some((m) => m.toString() === userId.toString())) {
      return res.status(400).json({ success: false, message: 'You are already a member of this room.' });
    }

    // STRICT 2-MEMBER RULE: Room cannot accept a third member!
    if (room.members.length >= 2) {
      return res.status(403).json({
        success: false,
        message: 'This room is full! A room can only have exactly 2 active roommates.',
      });
    }

    // Add user as second member
    room.members.push(userId);
    await room.save();

    // Update user's roomId
    await User.findByIdAndUpdate(userId, { roomId: room._id });

    const populatedRoom = await Room.findById(room._id).populate('members', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Successfully joined room!',
      data: populatedRoom,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's current room
// @route   GET /api/rooms/my-room
exports.getMyRoom = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.roomId) {
      return res.status(200).json({ success: true, data: null, message: 'You have not joined any room yet.' });
    }

    const room = await Room.findById(user.roomId).populate('members', 'name email avatar');
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get room members
// @route   GET /api/rooms/members
exports.getRoomMembers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.roomId) {
      return res.status(400).json({ success: false, message: 'User does not belong to any room.' });
    }

    const room = await Room.findById(user.roomId).populate('members', 'name email avatar');
    res.status(200).json({ success: true, data: room.members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
