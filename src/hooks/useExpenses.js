import { useState, useEffect, useCallback } from 'react';

export function useExpenses() {
    const [expenses, setExpenses] = useState([]);
    const [budget, setBudgetState] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [expensesRes, budgetRes] = await Promise.all([
                fetch('/api/expenses'),
                fetch('/api/budget')
            ]);

            if (expensesRes.ok) {
                const expensesData = await expensesRes.json();
                setExpenses(expensesData);
            }

            if (budgetRes.ok) {
                const budgetData = await budgetRes.json();
                setBudgetState(budgetData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addExpense = async (expense) => {
        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense),
            });

            if (res.ok) {
                const newExpense = await res.json();
                setExpenses((prev) => [newExpense, ...prev]);
            }
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            const res = await fetch(`/api/expenses/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setExpenses((prev) => prev.filter((e) => e.id !== id));
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const updateExpense = async (id, updatedData) => {
        try {
            const res = await fetch(`/api/expenses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (res.ok) {
                const updated = await res.json();
                setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating expense:', error);
            return false;
        }
    };

    const setBudget = async (category, amount) => {
        try {
            const res = await fetch('/api/budget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, amount }),
            });

            if (res.ok) {
                const updatedBudget = await res.json();
                setBudgetState((prev) => ({
                    ...prev,
                    [updatedBudget.category]: updatedBudget.amount,
                }));
            }
        } catch (error) {
            console.error('Error setting budget:', error);
        }
    };

    const getBalance = () => {
        return expenses.reduce((acc, curr) => {
            return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
        }, 0);
    };

    const getExpensesByCategory = () => {
        return expenses
            .filter((e) => e.type === 'expense')
            .reduce((acc, curr) => {
                acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
                return acc;
            }, {});
    };

    return {
        expenses,
        budget,
        addExpense,
        deleteExpense,
        updateExpense,
        setBudget,
        balance: getBalance(),
        expensesByCategory: getExpensesByCategory(),
        isLoaded,
    };
}
