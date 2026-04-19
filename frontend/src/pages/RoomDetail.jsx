import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  PackageOpen,
  IndianRupee,
  Trash2,
  ShoppingBag,
  X,
} from 'lucide-react';
import API from '../api/api.js';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add item form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', amount: '' });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  // Fetch room + items
  const fetchData = async () => {
    try {
      const res = await API.get(`/room/${id}/items`);
      setRoom(res.data.room);
      setItems(res.data.items);
    } catch (err) {
      console.error('Failed to fetch room data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError('');
    setAdding(true);
    try {
      const res = await API.post(`/room/${id}/items`, {
        name: formData.name.trim(),
        amount: Number(formData.amount),
      });
      setItems((prev) => [...prev, res.data.item]);
      setFormData({ name: '', amount: '' });
      setShowForm(false);
    } catch (err) {
      setError(err?.response?.data?.msg || 'Failed to add item');
    } finally {
      setAdding(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--glass-border)] border-t-[var(--text-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 md:p-8 pt-12 transition-colors duration-500">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all text-sm font-semibold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Room Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                {room?.purpose}
              </h1>
              <p className="text-[var(--text-secondary)] text-sm font-medium mt-1">
                {room?.member} member{room?.member !== 1 ? 's' : ''} &nbsp;·&nbsp;{' '}
                {room?.memberNames?.join(', ')}
              </p>
              <p>Room code : {room?.code}</p>
            </div>

            {/* Total */}
            <div className="glass-card p-4 md:p-5 text-center min-w-[130px] shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">
                Total
              </p>
              <div className="flex items-center justify-center gap-1">
                <IndianRupee className="w-5 h-5 opacity-70" />
                <span className="text-2xl font-black">
                  {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Items Section */}
        <div className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 opacity-40" />
              Items
              <span className="text-xs font-bold opacity-40 ml-1">({items.length})</span>
            </h2>
            <button
              id="add-item-btn"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-white/10 dark:hover:bg-white/10 hover:bg-black/5 text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {/* Add Item Modal */}
          <AnimatePresence>
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="glass-card w-full max-w-md p-8 relative"
                >
                  {/* Close */}
                  <button
                    onClick={() => { setShowForm(false); setError(''); }}
                    className="absolute top-6 right-6 p-2 rounded-lg hover:bg-white/5 transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h2 className="text-2xl font-black mb-1">Add Item</h2>
                  <p className="text-[var(--text-secondary)] text-sm mb-8">
                    Enter the item details below
                  </p>

                  <form onSubmit={handleAddItem} className="space-y-6">
                    {/* Item Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">
                        Item Name
                      </label>
                      <input
                        required
                        type="text"
                        id="item-name"
                        placeholder="e.g. Pizza, Movie Tickets, Hotel"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:border-white/20 outline-none transition-all placeholder:opacity-20 text-[var(--text-primary)]"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">
                        Amount (₹)
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                        <input
                          required
                          type="number"
                          id="item-amount"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-5 py-3.5 focus:border-white/20 outline-none transition-all placeholder:opacity-20 text-[var(--text-primary)]"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <p className="text-red-400 text-sm font-medium px-1">{error}</p>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => { setShowForm(false); setError(''); }}
                        className="flex-1 px-6 py-4 rounded-xl border border-white/5 hover:bg-white/5 font-bold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={adding}
                        className="flex-1 px-6 py-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold hover:opacity-90 transition-all shadow-xl disabled:opacity-50"
                      >
                        {adding ? 'Adding...' : 'Add Item'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Items List */}
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 flex flex-col items-center justify-center text-center gap-4"
            >
              <PackageOpen className="w-12 h-12 opacity-20" />
              <div>
                <p className="font-bold opacity-60">No items yet</p>
                <p className="text-[var(--text-secondary)] text-sm mt-1">
                  Click <strong>Add Item</strong> to start tracking expenses.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card overflow-hidden"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between px-6 py-4 ${
                    index !== items.length - 1
                      ? 'border-b border-[var(--glass-border)]'
                      : ''
                  } hover:bg-white/5 transition-all group`}
                >
                  {/* Left – index + name */}
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-xl border border-[var(--glass-border)] flex items-center justify-center text-xs font-black opacity-40 shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-sm md:text-base">{item.name}</p>
                      {item.addedBy?.name && (
                        <p className="text-[var(--text-secondary)] text-xs mt-0.5">
                          Added by {item.addedBy.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right – amount */}
                  <div className="flex items-center gap-3">
                    <span className="font-black text-base md:text-lg flex items-center gap-0.5">
                      <IndianRupee className="w-4 h-4 opacity-60" />
                      {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Total row */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--glass-border)] bg-white/[0.03]">
                <span className="text-xs font-black uppercase tracking-widest opacity-40">
                  Total
                </span>
                <span className="font-black text-lg flex items-center gap-0.5">
                  <IndianRupee className="w-4 h-4 opacity-60" />
                  {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
