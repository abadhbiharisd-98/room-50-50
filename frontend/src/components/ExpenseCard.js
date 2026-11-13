import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { getCategoryById } from '../constants/categories';
import { formatCurrency } from '../utils/calculations';

export default function ExpenseCard({ expense, userA, userB, onPress }) {
  const category = getCategoryById(expense.category);
  const isPaidByA = expense.paidBy === userA.id;
  const payerName = isPaidByA ? userA.shortName : userB.shortName;
  const payerColor = isPaidByA ? COLORS.accent : COLORS.successDark;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress && onPress(expense)}
    >
      {/* Category Icon */}
      <View style={[styles.iconContainer, { backgroundColor: category.bg, borderColor: `${category.color}25` }]}>
        <Ionicons name={category.icon} size={22} color={category.color} />
      </View>

      {/* Details */}
      <View style={styles.detailsBlock}>
        <Text style={styles.title} numberOfLines={1}>{expense.title}</Text>
        
        <View style={styles.metaRow}>
          {/* Payer Pill */}
          <View style={[styles.payerBadge, { backgroundColor: isPaidByA ? '#EFF6FF' : '#F0FDF4' }]}>
            <View style={[styles.payerDot, { backgroundColor: payerColor }]} />
            <Text style={[styles.payerText, { color: payerColor }]}>
              {payerName} paid
            </Text>
          </View>

          {/* Date */}
          <Text style={styles.dateText}>{formatDate(expense.date)}</Text>

          {/* Split indicator */}
          <View style={styles.splitBadge}>
            <Text style={styles.splitIndicator}>
              {expense.splitType === 'EQUAL_50_50' ? '50/50' : 'Custom'}
            </Text>
          </View>
        </View>
      </View>

      {/* Amount and Share */}
      <View style={styles.amountBlock}>
        <Text style={styles.amountText}>{formatCurrency(expense.amountPaise)}</Text>
        <Text style={styles.shareText}>
          {formatCurrency(expense.shareAPaise || Math.floor(expense.amountPaise / 2))} /ea
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={14} color="#CBD5E1" style={{ marginLeft: 6 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.subtle,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
  },
  detailsBlock: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  payerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    gap: 4,
  },
  payerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  payerText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  splitBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  splitIndicator: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '700',
  },
  amountBlock: {
    alignItems: 'flex-end',
    marginLeft: SPACING.xs,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  shareText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },
});
