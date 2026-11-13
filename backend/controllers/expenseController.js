const Expense = require('../models/Expense');
const User = require('../models/User');

// Helper to calculate integer paise share
const calculateShares = (amountPaise, splitType, customPercentA) => {
  let shareAPaise = 0;
  let shareBPaise = 0;

  switch (splitType) {
    case 'EQUAL_50_50':
      shareAPaise = Math.floor(amountPaise / 2);
      shareBPaise = amountPaise - shareAPaise;
      break;
    case 'PAID_BY_A_ONLY':
      shareAPaise = amountPaise;
      shareBPaise = 0;
      break;
    case 'PAID_BY_B_ONLY':
      shareAPaise = 0;
      shareBPaise = amountPaise;
      break;
    case 'CUSTOM_PERCENT': {
      const pct = Math.max(0, Math.min(100, customPercentA || 50));
      shareAPaise = Math.round((amountPaise * pct) / 100);
      shareBPaise = amountPaise - shareAPaise;
      break;
    }
    default:
      shareAPaise = Math.floor(amountPaise / 2);
      shareBPaise = amountPaise - shareAPaise;
  }
  return { shareAPaise, shareBPaise };
};

// @desc    Add new expense
// @route   POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const { title, amountPaise, category, splitType, customPercentA, date, description, paidBy } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.roomId) {
      return res.status(400).json({ success: false, message: 'Please create or join a room first.' });
    }

    if (!title || !amountPaise) {
      return res.status(400).json({ success: false, message: 'Title and amount in paise are required.' });
    }

    const { shareAPaise, shareBPaise } = calculateShares(amountPaise, splitType, customPercentA);

    const expense = await Expense.create({
      roomId: user.roomId,
      title: title.trim(),
      amountPaise: Number(amountPaise),
      category: category || 'other',
      paidBy: paidBy || req.user._id,
      splitType: splitType || 'EQUAL_50_50',
      shareAPaise,
      shareBPaise,
      customPercentA: customPercentA || 50,
      date: date || new Date().toISOString().split('T')[0],
      description: description || '',
    });

    const populated = await Expense.findById(expense._id).populate('paidBy', 'name email avatar');

    // Real-time Socket.IO emission to room members
    const io = req.app.get('io');
    if (io) {
      io.to(user.roomId.toString()).emit('expense_added', populated);
    }

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all expenses for the room
// @route   GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.roomId) {
      return res.status(200).json({ success: true, data: [] });
    }

    const { category, month } = req.query;
    const query = { roomId: user.roomId };

    if (category && category !== 'ALL') {
      query.category = category;
    }

    if (month) {
      // Month format: '2026-11'
      query.date = { $regex: `^${month}` };
    }

    const expenses = await Expense.find(query)
      .populate('paidBy', 'name email avatar')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single expense by ID
// @route   GET /api/expenses/:id
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('paidBy', 'name email avatar');
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    // Verify room access
    const user = await User.findById(req.user._id);
    if (expense.roomId.toString() !== user.roomId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this expense.' });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    const user = await User.findById(req.user._id);
    if (expense.roomId.toString() !== user.roomId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this expense.' });
    }

    const { title, amountPaise, category, splitType, customPercentA, date, description, paidBy } = req.body;

    if (amountPaise) {
      const { shareAPaise, shareBPaise } = calculateShares(
        amountPaise,
        splitType || expense.splitType,
        customPercentA || expense.customPercentA
      );
      expense.amountPaise = Number(amountPaise);
      expense.shareAPaise = shareAPaise;
      expense.shareBPaise = shareBPaise;
    }

    if (title) expense.title = title.trim();
    if (category) expense.category = category;
    if (splitType) expense.splitType = splitType;
    if (date) expense.date = date;
    if (description !== undefined) expense.description = description;
    if (paidBy) expense.paidBy = paidBy;

    await expense.save();

    const populated = await Expense.findById(expense._id).populate('paidBy', 'name email avatar');

    // Socket.IO emission
    const io = req.app.get('io');
    if (io) {
      io.to(user.roomId.toString()).emit('expense_updated', populated);
    }

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    const user = await User.findById(req.user._id);
    if (expense.roomId.toString() !== user.roomId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this expense.' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    // Socket.IO emission
    const io = req.app.get('io');
    if (io) {
      io.to(user.roomId.toString()).emit('expense_deleted', { id: req.params.id });
    }

    res.status(200).json({ success: true, message: 'Expense deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
