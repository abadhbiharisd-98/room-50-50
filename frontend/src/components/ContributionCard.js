import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

  const percentA = totalMonthlyPaise > 0 ? Math.round((totalPaidByAPaise / totalMonthlyPaise) * 100) : 50;
  const percentB = 100 - percentA;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>ROOMMATES SPLIT</Text>
          <View style={styles.pill5050}>
            <Text style={styles.pill5050Text}>50% Target</Text>
          </View>
        </View>
        <Text style={styles.subtext}>Monthly Contribution</Text>
      </View>

      {/* Two Column Comparison Cards */}
      <View style={styles.columnsWrapper}>
        {/* User A Column */}
        <View style={[styles.userBox, styles.userBoxA]}>
          <View style={styles.userHeader}>
            <View style={[styles.avatarBadge, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
              <Text style={styles.avatarText}>{userA.avatar || '👨‍💼'}</Text>
            </View>
            <View style={styles.userNameBlock}>
              <Text style={styles.userName} numberOfLines={1}>{userA.shortName}</Text>
              <Text style={[styles.userTag, { color: COLORS.accent }]}>Roommate A</Text>
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
            <View style={[styles.avatarBadge, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <Text style={styles.avatarText}>{userB.avatar || '🧑‍💻'}</Text>
            </View>
            <View style={styles.userNameBlock}>
              <Text style={styles.userName} numberOfLines={1}>{userB.shortName}</Text>
              <Text style={[styles.userTag, { color: COLORS.successDark }]}>Roommate B</Text>
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

      {/* Progress Ratio Bar */}
      <View style={styles.progressSection}>
        <View style={styles.ratioHeader}>
          <View style={styles.ratioLabelRow}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.accent }]} />
            <Text style={styles.ratioTextA}>{userA.shortName}: {percentA}%</Text>
          </View>

          <Text style={styles.ratioTitle}>Payment Ratio</Text>

          <View style={styles.ratioLabelRow}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.ratioTextB}>{userB.shortName}: {percentB}%</Text>
          </View>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.8,
  },
  pill5050: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pill5050Text: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accent,
  },
  subtext: {
    fontSize: 11,
    color: '#94A3B8',
  },
  columnsWrapper: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  userBox: {
    flex: 1,
    borderRadius: 18,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 18,
  },
  userNameBlock: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  userTag: {
    fontSize: 10,
    fontWeight: '600',
  },
  amountBlock: {
    marginTop: 4,
  },
  amountLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
    fontWeight: '500',
  },
  amountValue: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  shareBlock: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.8)',
  },
  shareLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  shareValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  progressSection: {
    marginTop: SPACING.lg,
  },
  ratioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratioLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  ratioTextA: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accent,
  },
  ratioTitle: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  ratioTextB: {
    fontSize: 11,
    fontWeight: '800',
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
