import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { formatCurrency } from '../utils/calculations';

export default function BalanceCard({ summary, userA, userB }) {
  const {
    totalMonthlyPaise,
    netBalanceAPaise,
    owedAmountPaise,
    debtor,
    creditor,
    isSettled,
  } = summary;

  const debtorDisplayName = debtor?.shortName || debtor?.name || (debtor?.id === userA?.id ? userA.shortName : userB.shortName);
  const creditorDisplayName = creditor?.shortName || creditor?.name || (creditor?.id === userA?.id ? userA.shortName : userB.shortName);

  return (
    <View style={styles.card}>
      {/* Top Header: Total Expenses */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>TOTAL MONTHLY EXPENSES</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalMonthlyPaise)}</Text>
        </View>
        <View style={styles.badgeMonthly}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.accentLight} />
          <Text style={styles.badgeMonthlyText}>50-50 Split</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Settlement Section: Who Owes Whom */}
      <View style={styles.settlementSection}>
        <View style={styles.statusRow}>
          <View style={[styles.statusIconBox, isSettled ? styles.settledIconBox : styles.dueIconBox]}>
            <Ionicons
              name={isSettled ? "checkmark-circle" : "swap-horizontal"}
              size={22}
              color={isSettled ? COLORS.success : "#F59E0B"}
            />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.settlementTitle}>
              {isSettled ? 'ALL SETTLED UP' : 'CURRENT SETTLEMENT STATUS'}
            </Text>
            {isSettled ? (
              <Text style={styles.settledText}>Both roommates are equal! No pending dues.</Text>
            ) : (
              <Text style={styles.oweHighlight}>
                <Text style={styles.debtorName}>{debtorDisplayName}</Text>
                {' owes '}
                <Text style={styles.creditorName}>{creditorDisplayName}</Text>
                {' '}
                <Text style={styles.oweAmount}>{formatCurrency(owedAmountPaise)}</Text>
              </Text>
            )}
          </View>
        </View>

        {/* Visual Pill Indicator */}
        <View style={[styles.pillContainer, isSettled ? styles.pillSettled : styles.pillDue]}>
          <Ionicons
            name={isSettled ? 'shield-checkmark' : 'information-circle'}
            size={16}
            color={isSettled ? COLORS.successDark : COLORS.accent}
          />
          <Text style={[styles.pillText, isSettled ? styles.pillTextSettled : styles.pillTextDue]}>
            {isSettled
              ? 'Exact ₹0 balance between roommates'
              : netBalanceAPaise > 0
              ? `${userA.shortName} has paid ₹${(Math.abs(netBalanceAPaise)/100).toLocaleString('en-IN')} extra this month`
              : `${userB.shortName} has paid ₹${(Math.abs(netBalanceAPaise)/100).toLocaleString('en-IN')} extra this month`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    ...SHADOWS.floating,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  totalAmount: {
    color: COLORS.textWhite,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  badgeMonthly: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeMonthlyText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: SPACING.lg,
  },
  settlementSection: {
    gap: SPACING.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  statusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dueIconBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  settledIconBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusInfo: {
    flex: 1,
  },
  settlementTitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  settledText: {
    color: COLORS.success,
    fontSize: 15,
    fontWeight: '600',
  },
  oweHighlight: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '500',
  },
  debtorName: {
    color: '#FCA5A5',
    fontWeight: '700',
  },
  creditorName: {
    color: '#86EFAC',
    fontWeight: '700',
  },
  oweAmount: {
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: 18,
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pillDue: {
    backgroundColor: '#1E293B',
  },
  pillSettled: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  pillText: {
    fontSize: 12,
    flex: 1,
  },
  pillTextDue: {
    color: '#CBD5E1',
  },
  pillTextSettled: {
    color: '#A7F3D0',
    fontWeight: '600',
  },
});
