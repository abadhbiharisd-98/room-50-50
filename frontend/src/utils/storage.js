import AsyncStorage from '@react-native-async-storage/async-storage';

export const EXPENSES_STORAGE_KEY = '@roommates_expenses_v2';
export const ROOMMATES_STORAGE_KEY = '@roommates_users_v2';

export const DEFAULT_ROOMMATES = {
  userA: {
    id: 'user_a',
    name: 'Abadh (You)',
    shortName: 'Abadh',
    avatar: '👨‍💼',
    color: '#2563EB',
  },
  userB: {
    id: 'user_b',
    name: 'Mahesh Singer',
    shortName: 'Mahesh Singer',
    avatar: '🎤',
    color: '#059669',
  },
};

// Seed initial realistic expenses for the current month if storage is empty
const getInitialSeedExpenses = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = (d) => `${year}-${month}-${String(d).padStart(2, '0')}`;

  return [
    {
      id: 'seed-1',
      title: 'Flat Room Rent (This Month)',
      amountPaise: 1200000, // ₹12,000
      category: 'rent',
      paidBy: 'user_a',
      splitType: 'EQUAL_50_50',
      shareAPaise: 600000,
      shareBPaise: 600000,
      date: day(1),
      description: 'Monthly flat rent paid to landlord via UPI by Abadh',
      createdAt: new Date(year, now.getMonth(), 1).toISOString(),
    },
    {
      id: 'seed-2',
      title: 'Monthly Supermarket Grocery',
      amountPaise: 420000, // ₹4,200
      category: 'grocery',
      paidBy: 'user_b',
      splitType: 'EQUAL_50_50',
      shareAPaise: 210000,
      shareBPaise: 210000,
      date: day(3),
      description: 'Rice, Atta, Dal, Oil, Spices and snacks by Mahesh Singer',
      createdAt: new Date(year, now.getMonth(), 3).toISOString(),
    },
    {
      id: 'seed-3',
      title: 'Electricity Bill',
      amountPaise: 185000, // ₹1,850
      category: 'electricity',
      paidBy: 'user_a',
      splitType: 'EQUAL_50_50',
      shareAPaise: 92500,
      shareBPaise: 92500,
      date: day(5),
      description: 'State Electricity Board bill payment by Abadh',
      createdAt: new Date(year, now.getMonth(), 5).toISOString(),
    },
    {
      id: 'seed-4',
      title: 'Fresh Vegetables & Fruits',
      amountPaise: 75000, // ₹750
      category: 'vegetables',
      paidBy: 'user_b',
      splitType: 'EQUAL_50_50',
      shareAPaise: 37500,
      shareBPaise: 37500,
      date: day(7),
      description: 'Weekly mandi purchase by Mahesh Singer',
      createdAt: new Date(year, now.getMonth(), 7).toISOString(),
    },
    {
      id: 'seed-5',
      title: 'Wi-Fi Fiber Broadband',
      amountPaise: 99900, // ₹999
      category: 'internet',
      paidBy: 'user_b',
      splitType: 'EQUAL_50_50',
      shareAPaise: 49950,
      shareBPaise: 49950,
      date: day(10),
      description: '100 Mbps Unlimited monthly plan recharge by Mahesh Singer',
      createdAt: new Date(year, now.getMonth(), 10).toISOString(),
    },
  ];
};

export const getStoredExpenses = async () => {
  try {
    const json = await AsyncStorage.getItem(EXPENSES_STORAGE_KEY);
    if (json !== null) {
      return JSON.parse(json);
    }
    // Seed initial realistic expenses
    const seed = getInitialSeedExpenses();
    await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(seed));
    return seed;
  } catch (error) {
    console.error('Error reading expenses from storage:', error);
    return getInitialSeedExpenses();
  }
};

export const saveNewExpense = async (expense) => {
  try {
    const existing = await getStoredExpenses();
    const updated = [expense, ...existing];
    await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving new expense:', error);
    throw error;
  }
};

export const deleteStoredExpense = async (id) => {
  try {
    const existing = await getStoredExpenses();
    const filtered = existing.filter((item) => item.id !== id);
    await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export const resetToSampleData = async () => {
  try {
    const seed = getInitialSeedExpenses();
    await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(seed));
    return seed;
  } catch (error) {
    console.error('Error resetting expenses:', error);
    throw error;
  }
};
