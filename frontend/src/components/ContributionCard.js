import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { formatCurrency } from '../utils/calculations';

export default function ContributionCard({ summary, userA, userB }) {
  const {
    totalMonthlyPaise,
    totalPaidByAPaise,
    totalPaidByBPaise,
    totalShareAPaise,
    totalShareBPaise,
  } = summary;

  // Percentage of total expenses paid by each
  const percentA = totalMonthlyPaise > 0 ? Math.round((totalPaidByAPaise / totalMonthlyPaise) * 100) : 50;
  const percentB = 100 - percentA;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>ROOMMATES BREAKDOWN</Text>
        <Text style={styles.subtext}>Monthly Split (50% Each)</Text>
      </View>

      {/* Two Column Comparison */}
      <View style={styles.columnsWrapper}>
        {/* User A Column */}
        <View style={[styles.userBox, styles.userBoxA]}>
          <View style={styles.userHeader}>
            <View style={[styles.avatarBadge, { backgroundColor: '#DBEAFE' }]}>
              <Text style={styles.avatarText}>{userA.avatar || '👨‍💼'}</Text>
            </View>
            <View style={styles.userNameBlock}>
              <Text style={styles.userName} numberOfLines={1}>{userA.shortName}</Text>
              <Text style={styles.userTag}>Roommate A</Text>
            </View>
          </View>

          <View style={styles.amountBlock}>
            <Text style={styles.amountLabel}>Paid Out of Pocket</Text>
            <Text style={[styles.amountValue, { color: COLORS.accent }]}>
              {formatCurrency(totalPaidByAPaise)}
            </Text>
          </View>

          <View style={styles.shareBlock}>
            <Text style={styles.shareLabel}>Fair 50% Share</Text>
            <Text style={styles.shareValue}>{formatCurrency(totalShareAPaise)}</Text>
          </View>
        </View>

        {/* User B Column */}
        <View style={[styles.userBox, styles.userBoxB]}>
          <View style={styles.userHeader}>
            <View style={[styles.avatarBadge, { backgroundColor: '#D1FAE5' }]}>
              <Text style={styles.avatarText}>{userB.avatar || '🧑‍💻'}</Text>
            </View>
            <View style={styles.userNameBlock}>
              <Text style={styles.userName} numberOfLines={1}>{userB.shortName}</Text>
              <Text style={styles.userTag}>Roommate B</Text>
            </View>
          </View>

          <View style={styles.amountBlock}>
            <Text style={styles.amountLabel}>Paid Out of Pocket</Text>
            <Text style={[styles.amountValue, { color: COLORS.successDark }]}>
              {formatCurrency(totalPaidByBPaise)}
            </Text>
          </View>

          <View style={styles.shareBlock}>
            <Text style={styles.shareLabel}>Fair 50% Share</Text>
            <Text style={styles.shareValue}>{formatCurrency(totalShareBPaise)}</Text>
          </View>
        </View>
      </View>

      {/* Dynamic Ratio Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.ratioHeader}>
          <Text style={styles.ratioTextA}>{userA.shortName}: {percentA}%</Text>
          <Text style={styles.ratioTitle}>Payment Distribution</Text>
          <Text style={styles.ratioTextB}>{userB.shortName}: {percentB}%</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFillA, { width: `${percentA}%` }]} />
          <View style={[styles.progressBarFillB, { width: `${percentB}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  subtext: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  columnsWrapper: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  userBox: {
    flex: 1,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
  },
  userBoxA: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  userBoxB: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  avatarBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
  userNameBlock: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  userTag: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  amountBlock: {
    marginTop: 4,
  },
  amountLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  shareBlock: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  shareLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  shareValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  progressSection: {
    marginTop: SPACING.md,
  },
  ratioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratioTextA: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
  },
  ratioTitle: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  ratioTextB: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.successDark,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressBarFillA: {
    backgroundColor: COLORS.accent,
    height: '100%',
  },
  progressBarFillB: {
    backgroundColor: COLORS.success,
    height: '100%',
  },
});
