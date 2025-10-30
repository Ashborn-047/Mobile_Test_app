import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { api, Expense } from '../../utils/api';
import { storage } from '../../utils/storage';

export const BudgetBuddy = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = storage.get<Expense[]>('expenses') || [];
    setExpenses(saved);
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

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <Button onClick={() => navigate('/')} variant="secondary" className="mb-4">
          ← Back to Dashboard
        </Button>
        <div className="bg-gradient-to-r from-teal-light to-turquoise/70 rounded-2xl border border-turquoise/30 px-6 py-7 text-center shadow-[0_0_30px_rgba(9,218,198,0.08)]">
          <h1 className="font-bold text-[28px] leading-tight text-teal-dark">BudgetBuddy</h1>
          <p className="mt-2 text-[16px] text-teal-dark/80">Track and categorize your expenses intelligently</p>
        </div>
      </motion.div>

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
              <p className="text-3xl font-bold text-turquoise">${totalSpend.toFixed(2)}</p>
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
                  : 'You\'re doing great! Keep tracking to maintain healthy spending habits.'}
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
                    <span className="text-turquoise font-semibold">${total.toFixed(2)}</span>
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
                <p className="text-turquoise font-bold">${expense.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

