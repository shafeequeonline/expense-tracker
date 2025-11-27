'use client';

import { useExpenses } from '@/hooks/useExpenses';
import ExpenseForm from '@/components/ExpenseForm';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Wallet, TrendingUp, TrendingDown, Edit2 } from 'lucide-react';
import styles from './page.module.css';
import clsx from 'clsx';
import { useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { expenses, balance, addExpense, updateExpense, expensesByCategory, isLoaded } = useExpenses();
  const [editingExpense, setEditingExpense] = useState(null);

  if (!isLoaded) return null;

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
  };

  const handleUpdate = async (updatedData) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, updatedData);
      setEditingExpense(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const chartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
          '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', usePointStyle: true }
      }
    },
    cutout: '70%',
  };

  return (
    <div className={styles.grid}>
      <section className={styles.mainColumn}>
        <div className={clsx(styles.balanceCard, 'glass')}>
          <div className={styles.balanceHeader}>
            <Wallet size={24} className={styles.icon} />
            <span>Total Balance</span>
          </div>
          <h2 className={styles.balanceAmount}>${balance.toFixed(2)}</h2>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <TrendingDown size={16} className={styles.expenseIcon} />
              <span>Expenses: ${expenses.filter(e => e.type === 'expense').reduce((a, c) => a + c.amount, 0).toFixed(2)}</span>
            </div>
            <div className={styles.statItem}>
              <TrendingUp size={16} className={styles.incomeIcon} />
              <span>Income: ${expenses.filter(e => e.type === 'income').reduce((a, c) => a + c.amount, 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className={styles.recentTransactions}>
          <h3>Recent Transactions</h3>
          <div className={styles.transactionList}>
            {expenses.length === 0 ? (
              <p className={styles.emptyState}>No transactions yet.</p>
            ) : (
              expenses.map((expense) => (
                <div key={expense.id} className={clsx(styles.transactionItem, 'glass-hover')}>
                  <div className={styles.transactionInfo}>
                    <span className={styles.category}>{expense.category}</span>
                    <span className={styles.date}>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.transactionActions}>
                    <span className={clsx(styles.amount, expense.type === 'income' ? styles.income : styles.expense)}>
                      {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleEditClick(expense)}
                      className={styles.editBtn}
                      aria-label="Edit transaction"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <aside className={styles.sideColumn}>
        <div className={clsx(styles.chartCard, 'glass')}>
          <h3>Spending Breakdown</h3>
          {Object.keys(expensesByCategory).length > 0 ? (
            <div className={styles.chartWrapper}>
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p className={styles.emptyChart}>Add expenses to see breakdown</p>
          )}
        </div>

        <div className={styles.addExpenseCard}>
          <ExpenseForm
            key={editingExpense ? editingExpense.id : 'new'}
            onAdd={editingExpense ? handleUpdate : addExpense}
            initialData={editingExpense}
            onClose={editingExpense ? handleCancelEdit : undefined}
          />
        </div>
      </aside>
    </div>
  );
}
