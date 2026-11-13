import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { getCategoryById } from '../constants/categories';
import { formatCurrency } from '../utils/calculations';

export default function ExpenseCard({ expense, userA, userB, onPress, onDelete }) {
  const category = getCategoryById(expense.category);
  const isPaidByA = expense.paidBy === userA.id;
  const payerName = isPaidByA ? userA.shortName : userB.shortName;
  const payerColor = isPaidByA ? COLORS.accent : COLORS.successDark;

  // Format date cleanly
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
      activeOpacity={0.7}
      style={styles.card}
      onPress={() => onPress && onPress(expense)}
    >
      {/* Category Icon */}
      <View style={[styles.iconContainer, { backgroundColor: category.bg }]}>
        <Ionicons name={category.icon} size={22} color={category.color} />
      </View>

      {/* Details (Title, Who Paid, Date) */}
      <View style={styles.detailsBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {expense.title}
        </Text>
        <View style={styles.metaRow}>
          {/* Payer pill */}
          <View style={[styles.payerBadge, { backgroundColor: isPaidByA ? '#EFF6FF' : '#ECFDF5' }]}>
            <Ionicons
              name={isPaidByA ? 'person' : 'person-outline'}
              size={11}
              color={payerColor}
            />
            <Text style={[styles.payerText, { color: payerColor }]}>
              {payerName}
            </Text>
          </View>

          <Text style={styles.dateText}>{formatDate(expense.date)}</Text>

          {/* Split indicator */}
          <Text style={styles.splitIndicator}>
            {expense.splitType === 'EQUAL_50_50' ? '50/50' : 'Custom'}
          </Text>
        </View>
      </View>

      {/* Amount and Action */}
      <View style={styles.amountBlock}>
        <Text style={styles.amountText}>{formatCurrency(expense.amountPaise)}</Text>
        <Text style={styles.shareText}>
          {formatCurrency(expense.shareAPaise || Math.floor(expense.amountPaise / 2))}/ea
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  detailsBlock: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  payerText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  splitIndicator: {
    fontSize: 10,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: '600',
  },
  amountBlock: {
    alignItems: 'flex-end',
    marginLeft: SPACING.sm,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  shareText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
