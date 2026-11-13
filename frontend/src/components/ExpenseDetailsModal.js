import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { getCategoryById } from '../constants/categories';
import { formatCurrency } from '../utils/calculations';

export default function ExpenseDetailsModal({ visible, expense, onClose, onDelete, userA, userB }) {
  if (!expense) return null;

  const category = getCategoryById(expense.category);
  const isPaidByA = expense.paidBy === userA.id;
  const payer = isPaidByA ? userA : userB;

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${expense.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(expense.id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* Top category banner */}
          <View style={[styles.topBanner, { backgroundColor: category.bg }]}>
            <View style={[styles.iconCircle, { backgroundColor: '#FFFFFF' }]}>
              <Ionicons name={category.icon} size={28} color={category.color} />
            </View>
            <Text style={[styles.categoryName, { color: category.color }]}>{category.name}</Text>
            <Text style={styles.amountDisplay}>{formatCurrency(expense.amountPaise)}</Text>
          </View>

          {/* Details Body */}
          <View style={styles.body}>
            <Text style={styles.title}>{expense.title}</Text>
            {expense.description ? (
              <Text style={styles.description}>{expense.description}</Text>
            ) : null}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Paid By</Text>
              <View style={styles.payerBadge}>
                <Text style={styles.payerText}>{payer.name}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{expense.date}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Split Method</Text>
              <Text style={styles.infoValue}>
                {expense.splitType === 'EQUAL_50_50' ? '50/50 Equal Split' : 'Custom'}
              </Text>
            </View>

            {/* Shares */}
            <View style={styles.splitBox}>
              <View style={styles.splitItem}>
                <Text style={styles.splitUser}>{userA.shortName}&apos;s Share</Text>
                <Text style={styles.splitAmount}>
                  {formatCurrency(expense.shareAPaise || Math.floor(expense.amountPaise / 2))}
                </Text>
              </View>
              <View style={styles.splitDivider} />
              <View style={styles.splitItem}>
                <Text style={styles.splitUser}>{userB.shortName}&apos;s Share</Text>
                <Text style={styles.splitAmount}>
                  {formatCurrency(expense.shareBPaise || Math.ceil(expense.amountPaise / 2))}
                </Text>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  dialog: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    ...SHADOWS.floating,
  },
  topBanner: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...SHADOWS.small,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  amountDisplay: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 4,
  },
  body: {
    padding: SPACING.xl,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  payerBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  payerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  splitBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  splitItem: {
    flex: 1,
    alignItems: 'center',
  },
  splitDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  splitUser: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  splitAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  deleteBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.dangerLight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.danger,
  },
  closeBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
