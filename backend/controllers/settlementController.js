const Settlement = require('../models/Settlement');
const User = require('../models/User');

// @desc    Record a new settlement
// @route   POST /api/settlements
exports.recordSettlement = async (req, res) => {
  try {
    const { paidTo, amountPaise, date, notes } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.roomId) {
      return res.status(400).json({ success: false, message: 'User does not belong to any room.' });
    }

    if (!amountPaise || amountPaise <= 0) {
      return res.status(400).json({ success: false, message: 'Valid settlement amount in paise is required.' });
    }

    const settlement = await Settlement.create({
      roomId: user.roomId,
      paidBy: req.user._id,
      paidTo,
      amountPaise: Number(amountPaise),
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || '',
    });

    const populated = await Settlement.findById(settlement._id)
      .populate('paidBy', 'name email avatar')
      .populate('paidTo', 'name email avatar');

    // Real-time Socket.IO emission
    const io = req.app.get('io');
    if (io) {
      io.to(user.roomId.toString()).emit('settlement_created', populated);
    }

    res.status(201).json({ success: true, message: 'Settlement recorded successfully.', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get settlement history
// @route   GET /api/settlements
exports.getSettlements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.roomId) {
      return res.status(200).json({ success: true, data: [] });
    }

    const settlements = await Settlement.find({ roomId: user.roomId })
      .populate('paidBy', 'name email avatar')
      .populate('paidTo', 'name email avatar')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({ success: true, count: settlements.length, data: settlements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

