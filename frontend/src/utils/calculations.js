/**
 * calculations.js
 * 
 * Rules:
 * 1. Sabhi monetary calculations "integer paise" me kiye jaate hain.
 *    (e.g., ₹100.50 = 10050 paise). Isse JavaScript ke floating-point
 *    rounding bugs (0.1 + 0.2 = 0.30000000000000004) nahi aate!
 * 2. 50/50 Equal Split, Custom Percentage split, aur 100% individual
 *    payer split sab dynamically compute hote hain.
 */

// Rupees input string/number to integer Paise
export const rupeesToPaise = (rupees) => {
  if (!rupees || isNaN(rupees)) return 0;
  const num = typeof rupees === 'string' ? parseFloat(rupees.replace(/,/g, '')) : rupees;
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
};

// Integer Paise to Rupees decimal number
export const paiseToRupees = (paise) => {
  if (!paise || isNaN(paise)) return 0;
  return paise / 100;
};

// Format Integer Paise into Indian Rupee Currency String (e.g., ₹15,000 or ₹2,500.50)
export const formatCurrency = (paise, showDecimals = false) => {
  const rupees = paiseToRupees(paise);
  const formatted = rupees.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: showDecimals || (paise % 100 !== 0) ? 2 : 0,
  });
  return `₹${formatted}`;
};

/**
 * Split Types:
 * - 'EQUAL_50_50': Dono 50-50 share karte hain.
 * - 'PAID_BY_A_ONLY': 100% Roommate A ka kharcha (B owes nothing).
 * - 'PAID_BY_B_ONLY': 100% Roommate B ka kharcha (A owes nothing).
 * - 'CUSTOM_PERCENT': e.g., A: 60%, B: 40%
 */
export const calculateSplit = (amountPaise, splitType = 'EQUAL_50_50', customPercentA = 50) => {
  let shareAPaise = 0;
  let shareBPaise = 0;

  switch (splitType) {
    case 'EQUAL_50_50':
      // Odd paise case handle karne ke liye (e.g. 101 paise -> 50 paise & 51 paise)
      shareAPaise = Math.floor(amountPaise / 2);
      shareBPaise = amountPaise - shareAPaise;
      break;

    case 'PAID_BY_A_ONLY':
      // Roommate A ka personal kharcha
      shareAPaise = amountPaise;
      shareBPaise = 0;
      break;

    case 'PAID_BY_B_ONLY':
      // Roommate B ka personal kharcha
      shareAPaise = 0;
      shareBPaise = amountPaise;
      break;

    case 'CUSTOM_PERCENT': {
      const pctA = Math.max(0, Math.min(100, customPercentA));
      shareAPaise = Math.round((amountPaise * pctA) / 100);
      shareBPaise = amountPaise - shareAPaise;
      break;
    }

    default:
      shareAPaise = Math.floor(amountPaise / 2);
      shareBPaise = amountPaise - shareAPaise;
  }

  return { shareAPaise, shareBPaise };
};

/**
 * Calculate complete monthly totals, individual contributions, shares, and who owes whom.
 *
 * @param {Array} expenses - List of expense objects
 * @param {String} userAId - ID of Roommate A (e.g. 'user_a')
 * @param {String} userBId - ID of Roommate B (e.g. 'user_b')
 * @param {String} userAName - Name of Roommate A
 * @param {String} userBName - Name of Roommate B
 */
export const calculateMonthlySummary = (
  expenses = [],
  userAId = 'user_a',
  userBId = 'user_b',
  userAName = 'Abadh',
  userBName = 'Mahesh Singer'
) => {
  let totalMonthlyPaise = 0;
  let totalPaidByAPaise = 0;
  let totalPaidByBPaise = 0;
  let totalShareAPaise = 0;
  let totalShareBPaise = 0;

  // Category-wise totals
  const categoryTotals = {};

  expenses.forEach((exp) => {
    const amtPaise = Number(exp.amountPaise) || 0;
    totalMonthlyPaise += amtPaise;

    // Kaun pay kiya?
    if (exp.paidBy === userAId) {
      totalPaidByAPaise += amtPaise;
    } else if (exp.paidBy === userBId) {
      totalPaidByBPaise += amtPaise;
    }

    // Har ek ka share kitna banta hai
    let split = { shareAPaise: 0, shareBPaise: 0 };
    if (exp.shareAPaise !== undefined && exp.shareBPaise !== undefined) {
      split.shareAPaise = Number(exp.shareAPaise);
      split.shareBPaise = Number(exp.shareBPaise);
    } else {
      split = calculateSplit(amtPaise, exp.splitType || 'EQUAL_50_50', exp.customPercentA || 50);
    }

    totalShareAPaise += split.shareAPaise;
    totalShareBPaise += split.shareBPaise;

    // Category aggregation
    const catId = exp.category || 'other';
    categoryTotals[catId] = (categoryTotals[catId] || 0) + amtPaise;
  });

  /**
   * Final Settlement Calculation:
   *
   * Net Balance for Roommate A = (Total Paid by A) - (Total Share of A)
   * Net Balance for Roommate B = (Total Paid by B) - (Total Share of B)
   *
   * Note: netA + netB always equals 0!
   *
   * If netBalanceA > 0:
   *   Roommate A has paid MORE than their fair share.
   *   So Roommate B owes Roommate A this difference.
   *
   * If netBalanceA < 0:
   *   Roommate A has paid LESS than their fair share.
   *   So Roommate A owes Roommate B this difference.
   */
  const netBalanceAPaise = totalPaidByAPaise - totalShareAPaise;
  const netBalanceBPaise = totalPaidByBPaise - totalShareBPaise;

  let settlementText = '';
  let debtor = null;
  let creditor = null;
  let owedAmountPaise = 0;
  let isSettled = false;

  if (netBalanceAPaise > 0) {
    // B owes A
    debtor = { id: userBId, name: userBName };
    creditor = { id: userAId, name: userAName };
    owedAmountPaise = netBalanceAPaise;
    settlementText = `${userBName} owes ${userAName} ${formatCurrency(owedAmountPaise)}`;
  } else if (netBalanceAPaise < 0) {
    // A owes B
    debtor = { id: userAId, name: userAName };
    creditor = { id: userBId, name: userBName };
    owedAmountPaise = Math.abs(netBalanceAPaise);
    settlementText = `${userAName} owes ${userBName} ${formatCurrency(owedAmountPaise)}`;
  } else {
    isSettled = true;
    settlementText = 'All settled up! No pending dues.';
  }

  // Convert category totals into sorted list with percentage
  const categorySummaryList = Object.keys(categoryTotals).map((catId) => {
    const amountPaise = categoryTotals[catId];
    const percentage = totalMonthlyPaise > 0 ? Math.round((amountPaise / totalMonthlyPaise) * 100) : 0;
    return {
      categoryId: catId,
      amountPaise,
      percentage,
    };
  }).sort((a, b) => b.amountPaise - a.amountPaise);

  return {
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
    categorySummaryList,
  };
};

