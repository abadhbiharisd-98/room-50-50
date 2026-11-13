import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { EXPENSE_CATEGORIES } from '../constants/categories';
import { rupeesToPaise, calculateSplit } from '../utils/calculations';

export default function AddExpenseModal({ visible, onClose, onSave, userA, userB }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id);
  const [paidBy, setPaidBy] = useState(userA.id);
  const [splitType, setSplitType] = useState('EQUAL_50_50');
  const [description, setDescription] = useState('');
  const [customPercentA, setCustomPercentA] = useState(50);
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory(EXPENSE_CATEGORIES[0].id);
    setPaidBy(userA.id);
    setSplitType('EQUAL_50_50');
    setDescription('');
    setCustomPercentA(50);
    setErrorMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!title.trim()) {
      setErrorMessage('Please enter an expense title (e.g., Grocery, Rent)');
      return;
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid expense amount in ₹');
      return;
    }

    const amountPaise = rupeesToPaise(amount);
    const { shareAPaise, shareBPaise } = calculateSplit(amountPaise, splitType, customPercentA);

    const now = new Date();
    const newExpense = {
      id: `exp-${Date.now()}`,
      title: title.trim(),
      amountPaise,
      category,
      paidBy,
      splitType,
      shareAPaise,
      shareBPaise,
      customPercentA: splitType === 'CUSTOM_PERCENT' ? customPercentA : 50,
      description: description.trim(),
      date: now.toISOString().split('T')[0],
      createdAt: now.toISOString(),
    };

    onSave(newExpense);
    handleClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Add New Expense</Text>
              <Text style={styles.modalSubtitle}>Shared roommate expense split</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Error banner */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EXPENSE TITLE *</Text>
              <View style={styles.inputBox}>
                <Ionicons name="receipt-outline" size={20} color={COLORS.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Milk & Eggs, Wi-Fi Recharge"
                  placeholderTextColor={COLORS.textMuted}
                  value={title}
                  onChangeText={(t) => {
                    setTitle(t);
                    setErrorMessage('');
                  }}
                />
              </View>
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>AMOUNT (₹) *</Text>
              <View style={[styles.inputBox, styles.amountInputBox]}>
                <Text style={styles.rupeePrefix}>₹</Text>
                <TextInput
                  style={[styles.textInput, styles.amountInput]}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={(val) => {
                    setAmount(val);
                    setErrorMessage('');
                  }}
                />
              </View>
            </View>

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CATEGORY</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryContainer}
              >
                {EXPENSE_CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        isSelected && { borderColor: cat.color, backgroundColor: cat.bg },
                      ]}
                      onPress={() => setCategory(cat.id)}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={18}
                        color={isSelected ? cat.color : COLORS.textMuted}
                      />
                      <Text
                        style={[
                          styles.categoryText,
                          isSelected && { color: cat.color, fontWeight: '700' },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Paid By Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>WHO PAID FOR THIS?</Text>
              <View style={styles.payerSelector}>
                <TouchableOpacity
                  style={[
                    styles.payerOption,
                    paidBy === userA.id && styles.payerOptionSelectedA,
                  ]}
                  onPress={() => setPaidBy(userA.id)}
                >
                  <Text style={styles.payerEmoji}>{userA.avatar || '👨‍💼'}</Text>
                  <View>
                    <Text style={[styles.payerName, paidBy === userA.id && styles.payerNameActiveA]}>
                      {userA.shortName}
                    </Text>
                    <Text style={styles.payerSub}>Paid out of pocket</Text>
                  </View>
                  {paidBy === userA.id && (
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.accent} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.payerOption,
                    paidBy === userB.id && styles.payerOptionSelectedB,
                  ]}
                  onPress={() => setPaidBy(userB.id)}
                >
                  <Text style={styles.payerEmoji}>{userB.avatar || '🧑‍💻'}</Text>
                  <View>
                    <Text style={[styles.payerName, paidBy === userB.id && styles.payerNameActiveB]}>
                      {userB.shortName}
                    </Text>
                    <Text style={styles.payerSub}>Paid out of pocket</Text>
                  </View>
                  {paidBy === userB.id && (
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.successDark} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Split Type Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>HOW TO SPLIT?</Text>
              <View style={styles.splitRow}>
                <TouchableOpacity
                  style={[styles.splitBtn, splitType === 'EQUAL_50_50' && styles.splitBtnActive]}
                  onPress={() => setSplitType('EQUAL_50_50')}
                >
                  <Text style={[styles.splitBtnText, splitType === 'EQUAL_50_50' && styles.splitBtnTextActive]}>
                    50 / 50 Equal
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.splitBtn, splitType === 'PAID_BY_A_ONLY' && styles.splitBtnActive]}
                  onPress={() => setSplitType('PAID_BY_A_ONLY')}
                >
                  <Text style={[styles.splitBtnText, splitType === 'PAID_BY_A_ONLY' && styles.splitBtnTextActive]}>
                    {userA.shortName} 100%
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.splitBtn, splitType === 'PAID_BY_B_ONLY' && styles.splitBtnActive]}
                  onPress={() => setSplitType('PAID_BY_B_ONLY')}
                >
                  <Text style={[styles.splitBtnText, splitType === 'PAID_BY_B_ONLY' && styles.splitBtnTextActive]}>
                    {userB.shortName} 100%
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Split Calculation Live Preview */}
              {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 ? (
                <View style={styles.splitPreviewCard}>
                  <Ionicons name="calculator-outline" size={16} color={COLORS.accent} />
                  <Text style={styles.splitPreviewText}>
                    {splitType === 'EQUAL_50_50'
                      ? `Each roommate owes ₹${(parseFloat(amount) / 2).toLocaleString('en-IN')}`
                      : splitType === 'PAID_BY_A_ONLY'
                      ? `${userA.shortName}'s personal expense (not shared)`
                      : `${userB.shortName}'s personal expense (not shared)`}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Description / Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NOTES / DESCRIPTION (OPTIONAL)</Text>
              <View style={[styles.inputBox, styles.notesBox]}>
                <TextInput
                  style={[styles.textInput, styles.notesInput]}
                  placeholder="Add details, store name, or UPI reference..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  numberOfLines={2}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name="checkmark-sharp" size={18} color="#FFFFFF" />
              <Text style={styles.saveText}>Save Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...SHADOWS.floating,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.dangerLight,
    padding: 10,
    borderRadius: 10,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 48,
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  amountInputBox: {
    height: 56,
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
  },
  rupeePrefix: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.accent,
  },
  amountInput: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  categoryScroll: {
    marginTop: 4,
  },
  categoryContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  payerSelector: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  payerOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  payerOptionSelectedA: {
    backgroundColor: '#EFF6FF',
    borderColor: COLORS.accent,
  },
  payerOptionSelectedB: {
    backgroundColor: '#F0FDF4',
    borderColor: COLORS.success,
  },
  payerEmoji: {
    fontSize: 24,
  },
  payerName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  payerNameActiveA: {
    color: COLORS.accent,
  },
  payerNameActiveB: {
    color: COLORS.successDark,
  },
  payerSub: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  splitRow: {
    flexDirection: 'row',
    gap: 8,
  },
  splitBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  splitBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  splitBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  splitBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  splitPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  splitPreviewText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
  },
  notesBox: {
    height: 70,
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  notesInput: {
    textAlignVertical: 'top',
    height: '100%',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  saveButton: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    ...SHADOWS.small,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

