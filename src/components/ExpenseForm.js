import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import styles from './ExpenseForm.module.css';
import clsx from 'clsx';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

export default function ExpenseForm({ onAdd, onClose, initialData = null }) {
    const [type, setType] = useState(initialData?.type || 'expense');
    const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
    const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
    const [description, setDescription] = useState(initialData?.description || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        onAdd({
            type,
            amount,
            category: type === 'income' ? 'Income' : category,
            description,
        });

        if (!initialData) {
            setAmount('');
            setDescription('');
        }
        if (onClose) onClose();
    };

    return (
        <form onSubmit={handleSubmit} className={clsx(styles.form, 'glass')}>
            <div className={styles.header}>
                <h3>{initialData ? 'Edit Transaction' : 'Add Transaction'}</h3>
                {onClose && (
                    <button type="button" onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                )}
            </div>

            <div className={styles.typeSelector}>
                <button
                    type="button"
                    className={clsx(styles.typeBtn, type === 'expense' && styles.activeExpense)}
                    onClick={() => setType('expense')}
                >
                    Expense
                </button>
                <button
                    type="button"
                    className={clsx(styles.typeBtn, type === 'income' && styles.activeIncome)}
                    onClick={() => setType('income')}
                >
                    Income
                </button>
            </div>

            <div className={styles.inputGroup}>
                <label>Amount</label>
                <div className={styles.amountInputWrapper}>
                    <span className={styles.currency}>$</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        required
                        className={styles.input}
                    />
                </div>
            </div>

            {type === 'expense' && (
                <div className={styles.inputGroup}>
                    <label>Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={styles.select}
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className={styles.inputGroup}>
                <label>Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this for?"
                    required
                    className={styles.input}
                />
            </div>

            <button type="submit" className={styles.submitBtn}>
                <Plus size={20} />
                {initialData ? 'Update Transaction' : 'Add Transaction'}
            </button>
        </form>
    );
}
