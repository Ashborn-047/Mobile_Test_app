import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { api } from '../../utils/api';
import { Expense } from '../../utils/types'; // Corrected import path for Expense
import { storage } from '../../utils/storage';
import { BudgetCSVImport } from "../Budget/components/BudgetCSVImport";

const currencyOptions = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'CNY', symbol: '¥', label: 'CNY (¥)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'AED', symbol: 'د.إ', label: 'AED (د.إ)' },
  { code: 'SAR', symbol: '﷼', label: 'SAR (﷼)' },
  { code: 'CHF', symbol: 'fr', label: 'CHF (fr)' },
  { code: 'SGD', symbol: 'S$', label: 'SGD (S$)' },
  { code: 'ZAR', symbol: 'R', label: 'ZAR (R)' },
];

const getCurrencySymbol = (code: string) => {
  return currencyOptions.find((c) => c.code === code)?.symbol || '$';
};

export const BudgetBuddy = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [budgetGoal, setBudgetGoal] = useState<number>(() => storage.get('budgetGoal') ?? 1000);

  useEffect(() => {
    const saved = storage.get<Expense[]>('expenses') || [];
    setExpenses(saved);
    setCurrency(storage.get('currency') || 'USD');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    setLoading(true);
    try {
      const category = await api.categorizeExpense(description, Number(amount));
      const newExpense: Expense = {
        id: Date.now().toString(),
        amount: Number(amount),
        category,
        description,
        date: new Date().toISOString(),
      };
      const updated = [...expenses, newExpense];
      setExpenses(updated);
      storage.set('expenses', updated);
      setDescription('');
      setAmount('');
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportExpenses = (imported: Expense[]) => {
    const updated = [...expenses, ...imported];
    setExpenses(updated);
    storage.set('expenses', updated);
    setShowImport(false);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
    storage.set('currency', e.target.value);
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Number(e.target.value));
    setBudgetGoal(val);
    storage.set('budgetGoal', val);
  };

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalSpend = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categories = Object.keys(categoryTotals);
  const maxCategory = categories.reduce((max, cat) =>
    categoryTotals[cat] > (categoryTotals[max] || 0) ? cat : max,
    categories[0] || ''
  );

  // Only use this month's expenses for prediction
  const currentMonth = new Date().getMonth();
  const thisMonthExpenses = expenses.filter((exp) => new Date(exp.date).getMonth() === currentMonth);
  const totalMonth = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  // Prediction: if avg daily spend continues, estimated end-of-month spend:
  const days = new Date().getDate();
  const daysInMonth = new Date().getMonth() === 1 ? 28 : 30;
  const estTotal = (totalMonth / days) * daysInMonth;

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <Button onClick={() => navigate('/')} variant="secondary" className="mb-4">
        ← Back to Dashboard
      </Button>

      {/* Currency selection and import button */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <label className="text-turquoise/90 font-medium">Currency: </label>
        <select value={currency} onChange={handleCurrencyChange} className="rounded-lg px-2 bg-teal-light/70 text-teal-dark border border-turquoise/40">
          {currencyOptions.map((option) => (
            <option key={option.code} value={option.code}>{option.label}</option>
          ))}
        </select>
        <Button variant="secondary" onClick={() => setShowImport((v) => !v)}>
          📄 Import Bank Statement (CSV)
        </Button>
      </div>

      {/* CSV Import UI */}
      {showImport && (
        <div className="mb-8">
          <BudgetCSVImport onImport={handleImportExpenses} />
        </div>
      )}

      {/* Budget Goal Section */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-turquoise mb-2">Monthly Budget Goal</h2>
            <input
              type="number"
              min="1"
              value={budgetGoal}
              onChange={handleGoalChange}
              className="px-4 py-2 rounded-lg border border-turquoise/30 bg-teal-light/50 text-turquoise/90 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise/10 text-lg font-semibold w-48"
            />
          </div>
          <div>
            <p className="text-turquoise text-sm">You have spent</p>
            <p className="text-turquoise text-2xl font-bold">{currencySymbol}{totalMonth.toFixed(2)}</p>
            <p className="text-turquoise text-sm">(of {currencySymbol}{budgetGoal})</p>
          </div>
          <div>
            {totalMonth > budgetGoal ? (
              <span className="text-red-500 font-bold">Over Budget!</span>
            ) : (
              <span className="text-green-500 font-bold">On Track ✅</span>
            )}
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-turquoise/20">
          <span className="text-turquoise/80 text-sm">
            {`At your current rate, you'll spend approx. ${currencySymbol}${estTotal.toFixed(2)} this month.`}
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-turquoise">Add Expense</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-4 py-3 bg-teal-light/50 border border-turquoise/30 rounded-xl text-turquoise placeholder-turquoise/40 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise/20"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              step="0.01"
              className="w-full px-4 py-3 bg-teal-light/50 border border-turquoise/30 rounded-xl text-turquoise placeholder-turquoise/40 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise/20"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Adding...' : 'Add Expense'}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 text-turquoise">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-turquoise/70 text-sm">Total Spent</p>
              <p className="text-3xl font-bold text-turquoise">{currencySymbol}{totalSpend.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-turquoise/70 text-sm">Top Category</p>
              <p className="text-xl font-semibold text-turquoise">{maxCategory || 'N/A'}</p>
            </div>
            <div className="pt-4 border-top border-turquoise/20">
              <p className="text-turquoise/70 text-sm mb-2">💡 Savings Tip</p>
              <p className="text-turquoise/90 text-sm">
                {totalSpend > 500 
                  ? 'Consider reviewing your top spending category for savings opportunities.'
                  : "You're doing great! Keep tracking to maintain healthy spending habits."}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {categories.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-turquoise">Spending by Category</h2>
          <div className="space-y-4">
            {categories.map((category) => {
              const total = categoryTotals[category];
              const percentage = (total / totalSpend) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between mb-2">
                    <span className="text-turquoise">{category}</span>
                    <span className="text-turquoise font-semibold">{currencySymbol}{total.toFixed(2)}</span>
                  </div>
                  <div className="relative h-3 bg-teal-light/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-turquoise rounded-full shadow-[0_0_10px_rgba(9,218,198,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: categories.indexOf(category) * 0.1 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-turquoise">Recent Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-turquoise/70">No expenses yet. Add your first expense above!</p>
        ) : (
          <div className="space-y-2">
            {expenses.slice(-10).reverse().map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center p-3 bg-teal-light/30 rounded-lg border border-turquoise/20"
              >
                <div>
                  <p className="text-turquoise font-medium">{expense.description}</p>
                  <p className="text-turquoise/60 text-sm">
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-turquoise font-bold">{currencySymbol}{expense.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

