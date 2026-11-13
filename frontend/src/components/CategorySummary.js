import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { getCategoryById } from '../constants/categories';
import { formatCurrency } from '../utils/calculations';

export default function CategorySummary({ summaryList }) {
  if (!summaryList || summaryList.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>CATEGORY BREAKDOWN</Text>
        <Text style={styles.subtext}>Monthly Spending Distribution</Text>
      </View>

      <View style={styles.list}>
        {summaryList.slice(0, 4).map((item) => {
          const category = getCategoryById(item.categoryId);
          return (
            <View key={item.categoryId} style={styles.itemRow}>
              {/* Category Icon & Name */}
              <View style={[styles.iconBox, { backgroundColor: category.bg }]}>
                <Ionicons name={category.icon} size={16} color={category.color} />
              </View>

              <View style={styles.nameAndBar}>
                <View style={styles.labelRow}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.amountText}>{formatCurrency(item.amountPaise)}</Text>
                </View>

                {/* Progress bar */}
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      { width: `${Math.min(100, Math.max(5, item.percentage))}%`, backgroundColor: category.color },
                    ]}
                  />
                </View>
              </View>

              <Text style={styles.percentText}>{item.percentage}%</Text>
            </View>
          );
        })}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  subtext: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  list: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameAndBar: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  amountText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  track: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    width: 34,
    textAlign: 'right',
  },
});

