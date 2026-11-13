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

  return (
    <View style={styles.card}>
      {/* Decorative ambient background accents */}
      <View style={styles.glowCircleTopRight} />

      {/* Top Header: Total Monthly Shared Expenses */}
      <View style={styles.headerRow}>
        <View>
          <View style={styles.labelRow}>
            <View style={styles.activeDot} />
            <Text style={styles.label}>TOTAL MONTHLY EXPENSES</Text>
          </View>
          <Text style={styles.totalAmount}>{formatCurrency(totalMonthlyPaise)}</Text>
        </View>

        <View style={styles.badgeSplit}>
          <Ionicons name="pie-chart" size={13} color="#60A5FA" />
          <Text style={styles.badgeSplitText}>50/50 Split</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Who Owes Whom Visual Settlement Section */}
      <View style={styles.settlementContainer}>
        <View style={styles.settlementHeader}>
          <Text style={styles.settlementTag}>
            {isSettled ? 'SETTLEMENT STATUS' : 'OUTSTANDING SETTLEMENT'}
          </Text>
          {isSettled ? (
            <View style={styles.settledBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#10B981" />
              <Text style={styles.settledBadgeText}>Zero Dues</Text>
            </View>
          ) : (
            <View style={styles.pendingBadge}>
              <Ionicons name="time-outline" size={12} color="#F59E0B" />
              <Text style={styles.pendingBadgeText}>Due Balance</Text>
            </View>
          )}
        </View>

        {isSettled ? (
          <View style={styles.settledBox}>
            <View style={styles.settledIconBox}>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settledMainText}>All Settled Up!</Text>
              <Text style={styles.settledSubText}>Both roommates have contributed equally.</Text>
            </View>
          </View>
        ) : (
          <View style={styles.transferCard}>
            {/* Visual Transfer Row: Debtor -> Amount -> Creditor */}
            <View style={styles.transferRow}>
              {/* Debtor (Who Pays) */}
              <View style={styles.transferUserBox}>
                <View style={[styles.avatarCircle, { backgroundColor: '#7F1D1D' }]}>
                  <Text style={styles.avatarEmoji}>{debtor?.id === userA.id ? (userA.avatar || '👨‍💼') : (userB.avatar || '🎤')}</Text>
                </View>
                <Text style={styles.transferUserName} numberOfLines={1}>
                  {debtor?.id === userA.id ? userA.shortName : userB.shortName}
                </Text>
                <Text style={styles.owesLabel}>Owes</Text>
              </View>

              {/* Arrow and Amount Center */}
              <View style={styles.amountMiddleBox}>
                <Text style={styles.transferAmount}>{formatCurrency(owedAmountPaise)}</Text>
                <View style={styles.arrowRow}>
                  <View style={styles.arrowLine} />
                  <Ionicons name="arrow-forward" size={16} color="#38BDF8" />
                </View>
                <Text style={styles.transferHint}>To Settle Up</Text>
              </View>

              {/* Creditor (Who Receives) */}
              <View style={styles.transferUserBox}>
                <View style={[styles.avatarCircle, { backgroundColor: '#064E3B' }]}>
                  <Text style={styles.avatarEmoji}>{creditor?.id === userA.id ? (userA.avatar || '👨‍💼') : (userB.avatar || '🎤')}</Text>
                </View>
                <Text style={styles.transferUserName} numberOfLines={1}>
                  {creditor?.id === userA.id ? userA.shortName : userB.shortName}
                </Text>
                <Text style={styles.receivesLabel}>Gets back</Text>
              </View>
            </View>
          </View>
        )}

        {/* Bottom Explanation Pill */}
        <View style={styles.infoPill}>
          <Ionicons
            name="information-circle-outline"
            size={15}
            color={isSettled ? '#34D399' : '#93C5FD'}
          />
          <Text style={styles.infoPillText}>
            {isSettled
              ? 'Exact ₹0 balance between roommates'
              : netBalanceAPaise > 0
              ? `${userA.shortName} has spent ₹${(Math.abs(netBalanceAPaise)/100).toLocaleString('en-IN')} more than fair share`
              : `${userB.shortName} has spent ₹${(Math.abs(netBalanceAPaise)/100).toLocaleString('en-IN')} more than fair share`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0B132B',
    borderRadius: 24,
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    ...SHADOWS.floatingCard,
    borderWidth: 1,
    borderColor: '#1C2541',
    position: 'relative',
    overflow: 'hidden',
  },
  glowCircleTopRight: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  label: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  badgeSplit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeSplitText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    marginVertical: SPACING.lg,
  },
  settlementContainer: {
    gap: 12,
  },
  settlementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settlementTag: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  settledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  settledBadgeText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pendingBadgeText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
  },
  settledBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  settledIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settledMainText: {
    color: '#34D399',
    fontSize: 15,
    fontWeight: '800',
  },
  settledSubText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  transferCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.8)',
  },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transferUserBox: {
    alignItems: 'center',
    width: 80,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  transferUserName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  owesLabel: {
    color: '#F87171',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  receivesLabel: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  amountMiddleBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  transferAmount: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 4,
  },
  arrowLine: {
    width: 38,
    height: 2,
    backgroundColor: '#38BDF8',
    borderRadius: 1,
  },
  transferHint: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  infoPillText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
});
