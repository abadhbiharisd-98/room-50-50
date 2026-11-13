export const EXPENSE_CATEGORIES = [
  {
    id: 'rent',
    name: 'Room Rent',
    icon: 'home',
    color: '#4F46E5', // Indigo
    bg: '#EEF2FF',
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    icon: 'nutrition',
    color: '#16A34A', // Green
    bg: '#F0FDF4',
  },
  {
    id: 'grocery',
    name: 'Grocery',
    icon: 'cart',
    color: '#D97706', // Amber
    bg: '#FFFBEB',
  },
  {
    id: 'electricity',
    name: 'Electricity',
    icon: 'flash',
    color: '#CA8A04', // Yellow
    bg: '#FEFCE8',
  },
  {
    id: 'water_bill',
    name: 'Water Bill',
    icon: 'water',
    color: '#0284C7', // Sky Blue
    bg: '#F0F9FF',
  },
  {
    id: 'milk',
    name: 'Milk',
    icon: 'cafe',
    color: '#7C3AED', // Violet
    bg: '#F5F3FF',
  },
  {
    id: 'internet',
    name: 'Internet',
    icon: 'wifi',
    color: '#2563EB', // Blue
    bg: '#EFF6FF',
  },
  {
    id: 'gas',
    name: 'Gas Cylinder',
    icon: 'flame',
    color: '#DC2626', // Red
    bg: '#FEF2F2',
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: 'sparkles',
    color: '#0D9488', // Teal
    bg: '#F0FDFA',
  },
  {
    id: 'household',
    name: 'Household Items',
    icon: 'cube',
    color: '#DB2777', // Pink
    bg: '#FDF2F8',
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'ellipsis-horizontal-circle',
    color: '#64748B', // Slate
    bg: '#F8FAFC',
  },
];

export const getCategoryById = (id) => {
  return EXPENSE_CATEGORIES.find((cat) => cat.id === id) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
};
