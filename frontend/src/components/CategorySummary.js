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
        <View style={styles.titleRow}>
          <Text style={styles.title}>CATEGORY BREAKDOWN</Text>
          <View style={styles.badgeTop}>
            <Text style={styles.badgeTopText}>Top Spends</Text>
          </View>
        </View>
        <Text style={styles.subtext}>Monthly Distribution</Text>
      </View>

      <View style={styles.list}>
        {summaryList.slice(0, 4).map((item) => {
          const category = getCategoryById(item.categoryId);
          return (
            <View key={item.categoryId} style={styles.itemRow}>
              {/* Category Icon */}
              <View style={[styles.iconBox, { backgroundColor: category.bg, borderColor: `${category.color}25` }]}>
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
                      { width: `${Math.min(100, Math.max(6, item.percentage))}%`, backgroundColor: category.color },
                    ]}
                  />
                </View>
              </View>

              <View style={[styles.percentBadge, { backgroundColor: category.bg }]}>
                <Text style={[styles.percentText, { color: category.color }]}>{item.percentage}%</Text>
              </View>
            </View>
          );
        })}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.8,
  },
  badgeTop: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeTopText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  subtext: {
    fontSize: 11,
    color: '#94A3B8',
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
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  nameAndBar: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  amountText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
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
  percentBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
