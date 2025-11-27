'use client';

import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import styles from './page.module.css';
import clsx from 'clsx';
import { Save, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

export default function BudgetPage() {
    const { budget, setBudget, expensesByCategory, isLoaded } = useExpenses();
    const [editingCategory, setEditingCategory] = useState(null);
    const [tempAmount, setTempAmount] = useState('');

    if (!isLoaded) return null;

    const handleEdit = (category, currentAmount) => {
        setEditingCategory(category);
        setTempAmount(currentAmount || '');
    };

    const handleSave = (category) => {
        setBudget(category, tempAmount);
        setEditingCategory(null);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>Monthly Budget</h2>
                <p>Plan your spending for each category</p>
            </header>

            <div className={styles.grid}>
                {CATEGORIES.map((category) => {
                    const budgetAmount = budget[category] || 0;
                    const spentAmount = expensesByCategory[category] || 0;
                    const percentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
                    const isOverBudget = spentAmount > budgetAmount && budgetAmount > 0;

                    return (
                        <div key={category} className={clsx(styles.card, 'glass')}>
                            <div className={styles.cardHeader}>
                                <h3>{category}</h3>
                                {editingCategory === category ? (
                                    <div className={styles.editWrapper}>
                                        <input
                                            type="number"
                                            value={tempAmount}
                                            onChange={(e) => setTempAmount(e.target.value)}
                                            className={styles.input}
                                            autoFocus
                                            onBlur={() => handleSave(category)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSave(category)}
                                        />
                                        <button onClick={() => handleSave(category)} className={styles.saveBtn}>
                                            <Save size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleEdit(category, budgetAmount)}
                                        className={styles.budgetDisplay}
                                    >
                                        Target: ${budgetAmount.toFixed(0)}
                                    </button>
                                )}
                            </div>

                            <div className={styles.progressWrapper}>
                                <div className={styles.progressLabels}>
                                    <span>${spentAmount.toFixed(0)} spent</span>
                                    <span className={isOverBudget ? styles.dangerText : ''}>
                                        {percentage.toFixed(0)}%
                                    </span>
                                </div>
                                <div className={styles.progressBarBg}>
                                    <div
                                        className={clsx(styles.progressBarFill, isOverBudget && styles.dangerFill)}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {isOverBudget && (
                                <div className={styles.alert}>
                                    <AlertCircle size={14} />
                                    <span>Over budget by ${(spentAmount - budgetAmount).toFixed(0)}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
