const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please enter an expense title'],
      trim: true,
    },
    amountPaise: {
      type: Number,
      required: [true, 'Expense amount in integer paise is required'],
      min: 1,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'rent',
        'vegetables',
        'grocery',
        'electricity',
        'water_bill',
        'milk',
        'internet',
        'gas',
        'cleaning',
        'household',
        'other',
      ],
      default: 'other',
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    splitType: {
      type: String,
      enum: ['EQUAL_50_50', 'PAID_BY_A_ONLY', 'PAID_BY_B_ONLY', 'CUSTOM_PERCENT'],
      default: 'EQUAL_50_50',
    },
    shareAPaise: {
      type: Number,
      default: 0,
    },
    shareBPaise: {
      type: Number,
      default: 0,
    },
    customPercentA: {
      type: Number,
      default: 50,
    },
    date: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema);

