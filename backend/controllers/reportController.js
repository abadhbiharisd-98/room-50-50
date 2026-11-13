const Expense = require('../models/Expense');
const Room = require('../models/Room');
const User = require('../models/User');

// @desc    Get monthly report and dynamic balance calculation
// @route   GET /api/reports/monthly
exports.getMonthlyReport = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.roomId) {
      return res.status(400).json({ success: false, message: 'User does not belong to any room.' });
    }

    const room = await Room.findById(user.roomId).populate('members', 'name email avatar');
    const { month } = req.query; // e.g. '2026-11'

    const query = { roomId: user.roomId };
    if (month) {
      query.date = { $regex: `^${month}` };
    }

    const expenses = await Expense.find(query);

    const memberA = room.members[0] || null;
    const memberB = room.members[1] || null;

    const userAId = memberA ? memberA._id.toString() : null;
    const userBId = memberB ? memberB._id.toString() : null;

    let totalMonthlyPaise = 0;
    let totalPaidByAPaise = 0;
    let totalPaidByBPaise = 0;
    let totalShareAPaise = 0;
    let totalShareBPaise = 0;

    const categoryTotals = {};

    expenses.forEach((exp) => {
      const amt = Number(exp.amountPaise) || 0;
      totalMonthlyPaise += amt;

      const payerId = exp.paidBy.toString();
      if (payerId === userAId) {
        totalPaidByAPaise += amt;
      } else if (payerId === userBId) {
        totalPaidByBPaise += amt;
      }

      totalShareAPaise += Number(exp.shareAPaise) || 0;
      totalShareBPaise += Number(exp.shareBPaise) || 0;

      const cat = exp.category || 'other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    });

    const netBalanceAPaise = totalPaidByAPaise - totalShareAPaise;
    const netBalanceBPaise = totalPaidByBPaise - totalShareBPaise;

    let settlementText = 'All settled up! No pending dues.';
    let debtor = null;
    let creditor = null;
    let owedAmountPaise = 0;
    let isSettled = true;

    if (netBalanceAPaise > 0) {
      isSettled = false;
      debtor = memberB;
      creditor = memberA;
      owedAmountPaise = netBalanceAPaise;
      settlementText = `${memberB ? memberB.name : 'Roommate B'} owes ${memberA ? memberA.name : 'Roommate A'} ₹${(owedAmountPaise / 100).toLocaleString('en-IN')}`;
    } else if (netBalanceAPaise < 0) {
      isSettled = false;
      debtor = memberA;
      creditor = memberB;
      owedAmountPaise = Math.abs(netBalanceAPaise);
      settlementText = `${memberA ? memberA.name : 'Roommate A'} owes ${memberB ? memberB.name : 'Roommate B'} ₹${(owedAmountPaise / 100).toLocaleString('en-IN')}`;
    }

    const categorySummary = Object.keys(categoryTotals).map((catId) => ({
      category: catId,
      amountPaise: categoryTotals[catId],
      percentage: totalMonthlyPaise > 0 ? Math.round((categoryTotals[catId] / totalMonthlyPaise) * 100) : 0,
    })).sort((a, b) => b.amountPaise - a.amountPaise);

    res.status(200).json({
      success: true,
      data: {
        totalMonthlyPaise,
        totalPaidByAPaise,
        totalPaidByBPaise,
        totalShareAPaise,
        totalShareBPaise,
        netBalanceAPaise,
        netBalanceBPaise,
        owedAmountPaise,
        debtor,
        creditor,
        settlementText,
        isSettled,
        categorySummary,
        memberA,
        memberB,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
