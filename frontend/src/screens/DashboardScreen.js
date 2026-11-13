import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { EXPENSE_CATEGORIES } from '../constants/categories';
import { calculateMonthlySummary } from '../utils/calculations';
import {
  DEFAULT_ROOMMATES,
  getStoredExpenses,
  saveNewExpense,
  deleteStoredExpense,
  resetToSampleData,
} from '../utils/storage';
import BalanceCard from '../components/BalanceCard';
import ContributionCard from '../components/ContributionCard';
import CategorySummary from '../components/CategorySummary';
import ExpenseCard from '../components/ExpenseCard';
import AddExpenseModal from '../components/AddExpenseModal';
import ExpenseDetailsModal from '../components/ExpenseDetailsModal';

export default function DashboardScreen() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Roommates info
  const userA = DEFAULT_ROOMMATES.userA;
  const userB = DEFAULT_ROOMMATES.userB;

  // Load expenses on mount
  const loadData = async () => {
    try {
      const data = await getStoredExpenses();
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Add new expense
  const handleAddExpense = async (newExp) => {
    try {
      const updated = await saveNewExpense(newExp);
      setExpenses(updated);
    } catch (err) {
      console.error('Failed to add expense:', err);
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id) => {
    try {
      const updated = await deleteStoredExpense(id);
      setExpenses(updated);
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  };

  // Reset demo data helper
  const handleResetData = async () => {
    setLoading(true);
    const seed = await resetToSampleData();
    setExpenses(seed);
    setLoading(false);
  };

  // Compute overall summary dynamically
  const summary = useMemo(() => {
    return calculateMonthlySummary(expenses, userA.id, userB.id, userA.shortName, userB.shortName);
  }, [expenses, userA, userB]);

  // Filtered expenses based on search and category
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchQuery, selectedCategoryFilter]);

  // Current month string
  const currentMonthName = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Top App Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.appIconCircle}>
            <Ionicons name="pie-chart" size={20} color="#FFFFFF" />
          </View>
          <View>
            <View style={styles.appNameRow}>
              <Text style={styles.appName}>RoomMates</Text>
              <View style={styles.badge5050}>
                <Text style={styles.badge5050Text}>50-50</Text>
              </View>
            </View>
            <Text style={styles.appSub}>Shared Expense Splitter</Text>
          </View>
        </View>

        {/* Room & Roommates Avatars */}
        <View style={styles.headerRight}>
          <View style={styles.avatarGroup}>
            <View style={[styles.miniAvatar, { backgroundColor: '#2563EB' }]}>
              <Text style={styles.miniAvatarText}>A</Text>
            </View>
            <View style={[styles.miniAvatar, { backgroundColor: '#059669', marginLeft: -8 }]}>
              <Text style={styles.miniAvatarText}>M</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleResetData} style={styles.resetBtn} accessibilityLabel="Reset demo data">
            <Ionicons name="refresh-outline" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Month Selector Bar */}
      <View style={styles.monthBar}>
        <TouchableOpacity style={styles.monthArrow}>
          <Ionicons name="chevron-back" size={18} color="#CBD5E1" />
        </TouchableOpacity>
        <View style={styles.monthCenter}>
          <Ionicons name="calendar" size={14} color="#38BDF8" />
          <Text style={styles.monthText}>{currentMonthName}</Text>
        </View>
        <TouchableOpacity style={styles.monthArrow}>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>
      </View>

      {/* Main Content ScrollView */}
      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loaderText}>Loading expenses...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={styles.mainScrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.accent]}
              tintColor={COLORS.accent}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Main Balance Card (Who Owes Whom) */}
          <BalanceCard summary={summary} userA={userA} userB={userB} />

          {/* 2. Roommates Contribution Comparison */}
          <ContributionCard summary={summary} userA={userA} userB={userB} />

          {/* 3. Category Breakdown */}
          <CategorySummary summaryList={summary.categorySummaryList} />

          {/* 4. Search and Filter Bar */}
          <View style={styles.filterSection}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search expenses..."
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Category Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              <TouchableOpacity
                style={[
                  styles.filterPill,
                  selectedCategoryFilter === 'ALL' && styles.filterPillActive,
                ]}
                onPress={() => setSelectedCategoryFilter('ALL')}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    selectedCategoryFilter === 'ALL' && styles.filterPillTextActive,
                  ]}
                >
                  All ({expenses.length})
                </Text>
              </TouchableOpacity>

              {EXPENSE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategoryFilter === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.filterPill, isSelected && styles.filterPillActive]}
                    onPress={() => setSelectedCategoryFilter(cat.id)}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={14}
                      color={isSelected ? '#FFFFFF' : cat.color}
                    />
                    <Text
                      style={[
                        styles.filterPillText,
                        isSelected && styles.filterPillTextActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* 5. Expense History List Header */}
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>EXPENSE HISTORY</Text>
              <Text style={styles.sectionSub}>
                {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'} recorded
              </Text>
            </View>
          </View>

          {/* Expenses List */}
          {filteredExpenses.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="receipt-outline" size={36} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No Expenses Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || selectedCategoryFilter !== 'ALL'
                  ? 'No matching expenses for the selected filter.'
                  : 'Start tracking by tapping "+ Add Expense" below!'}
              </Text>
            </View>
          ) : (
            filteredExpenses.map((exp) => (
              <ExpenseCard
                key={exp.id}
                expense={exp}
                userA={userA}
                userB={userB}
                onPress={(item) => setSelectedExpense(item)}
              />
            ))
          )}

          {/* Bottom spacing for FAB */}
          <View style={{ height: 90 }} />
        </ScrollView>
      )}

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fabButton}
        activeOpacity={0.85}
        onPress={() => setAddModalVisible(true)}
      >
        <Ionicons name="add" size={26} color="#FFFFFF" />
        <Text style={styles.fabText}>Add Expense</Text>
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <AddExpenseModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleAddExpense}
        userA={userA}
        userB={userB}
      />

      {/* Expense Details & Delete Modal */}
      <ExpenseDetailsModal
        visible={!!selectedExpense}
        expense={selectedExpense}
        onClose={() => setSelectedExpense(null)}
        onDelete={handleDeleteExpense}
        userA={userA}
        userB={userB}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    backgroundColor: '#070B19',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 12 : 12,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appName: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  badge5050: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  badge5050Text: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
  },
  appSub: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#070B19',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  resetBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthBar: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  monthCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  monthText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  monthArrow: {
    padding: 4,
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollContent: {
    paddingTop: SPACING.sm,
  },
  loaderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  filterSection: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: SPACING.sm,
    ...SHADOWS.subtle,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#0B132B',
    borderColor: '#0B132B',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.8,
  },
  sectionSub: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    marginHorizontal: SPACING.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.subtle,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 30,
    ...SHADOWS.fab,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});

