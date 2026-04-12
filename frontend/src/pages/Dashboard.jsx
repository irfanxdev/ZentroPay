import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Search, 
  Bell, 
  CreditCard, 
  TrendingUp,
  History
} from 'lucide-react';
import API from '../api/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [balance] = useState(12450.80);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/auth/dashboard');
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user info");
      }
    };
    fetchUser();
  }, []);

  const transactions = [
    { id: 1, name: 'Apple Store', type: 'expense', amount: 999.00, date: 'Today, 2:45 PM', category: 'Electronics' },
    { id: 2, name: 'Salary Deposit', type: 'income', amount: 4500.00, date: 'Yesterday', category: 'Work' },
    { id: 3, name: 'Netflix Subscription', type: 'expense', amount: 15.99, date: 'Oct 8, 2023', category: 'Entertainment' },
    { id: 4, name: 'Starbucks Coffee', type: 'expense', amount: 6.50, date: 'Oct 7, 2023', category: 'Food' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8 pt-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">{user?.name || 'User'}</span>
            </h1>
            <p className="text-[var(--text-secondary)] mt-1 font-medium">Here's what's happening with your accounts today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] hover:bg-white/10 transition-all">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] hover:bg-white/10 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[var(--bg-primary)]"></span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Balance Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-card p-8 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Wallet className="w-48 h-48" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-blue-400 uppercase tracking-[0.2em] mb-2">Total Balance</p>
                  <h2 className="text-5xl font-black text-[var(--text-primary)] tracking-tighter">
                    ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-bold text-sm shadow-xl hover:bg-zinc-200 transition-all">
                    <Plus className="w-4 h-4" /> Add Money
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[var(--glass-border)]">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Monthly Income</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-lg font-bold text-[var(--text-primary)]">$8,240.00</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Monthly Expenses</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-lg font-bold text-[var(--text-primary)]">$3,120.50</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions / Card Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 flex flex-col justify-between bg-[var(--accent)] text-[var(--bg-primary)]"
          >
            <div>
              <div className="flex justify-between items-center mb-10">
                <CreditCard className="w-8 h-8" />
                <span className="font-black text-lg italic tracking-tighter">ZentroPay</span>
              </div>
              <p className="text-sm font-bold opacity-60 uppercase tracking-[0.1em] mb-1">Card Number</p>
              <h3 className="text-xl font-bold tracking-[0.2em] mb-6">•••• •••• •••• 4290</h3>
              <div className="flex gap-8">
                <div>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Expiry</p>
                  <p className="font-bold">12/28</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">CVV</p>
                  <p className="font-bold">•••</p>
                </div>
              </div>
            </div>
            <button className="w-full py-4 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-primary)] font-bold text-sm tracking-tight mt-10 hover:opacity-90 transition-all">
              Freeze Card
            </button>
          </motion.div>

        </div>

        {/* Transactions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-card overflow-hidden"
          >
            <div className="p-8 border-b border-[var(--glass-border)] flex items-center justify-between">
              <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                Recent Activity
              </h3>
              <button className="text-sm font-bold text-blue-400 hover:underline transition-all">View all</button>
            </div>
            <div className="p-2">
              <table className="w-full text-left">
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {tx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--text-primary)]">{tx.name}</p>
                            <p className="text-xs text-[var(--text-secondary)] font-medium">{tx.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 hidden sm:table-cell">
                        <p className="text-sm text-[var(--text-secondary)] font-medium">{tx.date}</p>
                      </td>
                      <td className="p-6 text-right">
                        <p className={`font-black text-lg ${tx.type === 'income' ? 'text-emerald-500' : 'text-[var(--text-primary)]'}`}>
                          {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 space-y-8"
          >
            <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Spending Analysis
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'Shopping', amount: 1240, color: 'bg-blue-500', percent: 65 },
                { label: 'Food & Drinks', amount: 850, color: 'bg-emerald-500', percent: 45 },
                { label: 'Entertainment', amount: 420, color: 'bg-purple-500', percent: 25 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-[var(--text-secondary)]">{item.label}</span>
                    <span className="font-black text-[var(--text-primary)]">${item.amount}</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--glass-bg)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className={`h-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Savings Goal</p>
              <h4 className="text-xl font-bold text-[var(--text-primary)] mb-4">New Car Fund</h4>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-black text-[var(--text-primary)]">$12,400 <span className="text-sm opacity-40 font-bold">/ $25k</span></p>
                <p className="text-sm font-bold text-emerald-500">50%</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
