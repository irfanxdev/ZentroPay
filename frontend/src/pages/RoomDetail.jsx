import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  PackageOpen,
  IndianRupee,
  ShoppingBag,
  X,
  Wifi,
  WifiOff,
  Trash2,
  Download,
} from 'lucide-react';

import { io } from 'socket.io-client';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import API from '../api/api.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


  // Add item form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', amount: '' });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  // Live activity toast
  const [liveToast, setLiveToast] = useState(null);
  const toastTimer = useRef(null);

  const socketRef = useRef(null);

  // Current user id stored in localStorage (set during login)


  // ── Fetch room + items ───────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      const [roomRes, userRes] = await Promise.all([
        API.get(`/room/${id}/items`),
        API.get('/auth/dashboard'),
      ]);
      setRoom(roomRes.data.room);
      setItems(roomRes.data.items);
      setCurrentUser(userRes.data.user);
    } catch (err) {
      console.error('Failed to fetch room data', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Socket.IO setup ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchData();

    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-room', id);   // subscribe to this room's events
    });

    socket.on('disconnect', () => setConnected(false));

    // Real-time: new item added by any member
    socket.on('new-item', (item) => {
      setItems((prev) => {
        // guard against duplicates (our own POST response + socket event)
        if (prev.some((i) => i._id === item._id)) return prev;
        return [...prev, item];
      });

      // Show a brief live toast
      const adder = item.addedBy?.name || 'Someone';
      setLiveToast(`${adder} added "${item.name}"`);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setLiveToast(null), 3000);
    });

    // Real-time: item deleted by any member
    socket.on('delete-item', (itemId) => {
      setItems((prev) => prev.filter((i) => i._id !== itemId));
    });

    return () => {
      socket.disconnect();
      clearTimeout(toastTimer.current);
    };
  }, [id]);

  // ── Add Item ─────────────────────────────────────────────────────────────
  const handleAddItem = async (e) => {
    e.preventDefault();
    setError('');
    setAdding(true);
    try {
      const res = await API.post(`/room/${id}/items`, {
        name: formData.name.trim(),
        amount: Number(formData.amount),
      });
      // The socket 'new-item' event from the server will update the list for
      // ALL members (including ourselves via the deduplication guard above).
      // We also add it immediately here for instant local feedback.
      setItems((prev) => {
        if (prev.some((i) => i._id === res.data.item._id)) return prev;
        return [...prev, res.data.item];
      });
      setFormData({ name: '', amount: '' });
      setShowForm(false);
    } catch (err) {
      setError(err?.response?.data?.msg || 'Failed to add item');
    } finally {
      setAdding(false);
    }
  };

  // ── Delete Item ───────────────────────────────────────────────────────────
  const handleDeleteItem = async (itemId) => {
    try {
      await API.delete(`/room/${id}/items/${itemId}`);
      // Optimistic removal — socket 'delete-item' will sync other members
      setItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch (err) {
      alert(err?.response?.data?.msg || 'Failed to delete item');
    }
  };

  // ── Delete Room ───────────────────────────────────────────────────────────
  const handleDeleteRoom = async () => {
    if (!window.confirm('Delete this room? All items inside will also be removed.')) return;
    try {
      await API.delete(`/room/${id}`);
      navigate('/dashboard');
    } catch (err) {
      alert(err?.response?.data?.msg || 'Failed to delete room');
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  // ── Download PDF Report ────────────────────────────────────────────────
  const handleDownloadPDF = () => {
    if (!room) return;

    // 1. Calculate Summary
    const membersInfo = {};
    if (room.memberNames && room.memberNames.length > 0) {
      room.memberNames.forEach((name) => {
        membersInfo[name] = 0;
      });
    }

    items.forEach((item) => {
      const name = item.addedBy?.name || 'Unknown';
      if (membersInfo[name] === undefined) {
        membersInfo[name] = 0;
      }
      membersInfo[name] += item.amount;
    });

    // 2. Calculate Transactions
    const totalMembers = room.member || Object.keys(membersInfo).length || 1;
    const perPersonShare = totalAmount / totalMembers;

    const balances = [];
    for (const [name, paid] of Object.entries(membersInfo)) {
      balances.push({ name, balance: paid - perPersonShare });
    }

    // debtors owe money (balance < 0), creditors receive money (balance > 0)
    const debtors = balances.filter((b) => b.balance < -0.01).sort((a, b) => a.balance - b.balance);
    const creditors = balances.filter((b) => b.balance > 0.01).sort((a, b) => b.balance - a.balance);

    const transactions = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amountToSettle = Math.min(Math.abs(debtor.balance), creditor.balance);

      transactions.push({
        From: debtor.name,
        To: creditor.name,
        Amount: amountToSettle.toFixed(2),
      });

      debtor.balance += amountToSettle;
      creditor.balance -= amountToSettle;

      if (Math.abs(debtor.balance) < 0.01) i++;
      if (creditor.balance < 0.01) j++;
    }

    // 3. Construct PDF
    const doc = new jsPDF();
    let currentY = 14;

    // Title
    doc.setFontSize(18);
    doc.text(room.purpose || 'Room Report', 14, currentY);
    currentY += 10;

    // Summary Table
    doc.setFontSize(14);
    doc.text('Summary (Who paid how much)', 14, currentY);
    currentY += 6;

    const summaryData = Object.entries(membersInfo).map(([name, paid]) => [
      name,
      paid.toFixed(2),
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Name', 'Total Paid (Rs)']],
      body: summaryData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    currentY = doc.lastAutoTable.finalY + 14;

    // Transactions Table
    doc.setFontSize(14);
    doc.text('Transactions (Who paid to whom)', 14, currentY);
    currentY += 6;

    const transactionData = transactions.map((t) => [t.From, t.To, t.Amount]);

    autoTable(doc, {
      startY: currentY,
      head: [['From', 'To', 'Amount (Rs)']],
      body: transactionData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [39, 174, 96] },
    });

    // Save
    doc.save(`${room.purpose || 'room'}_report.pdf`);
  };


  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--glass-border)] border-t-[var(--text-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
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
                {room?.member} member{room?.member !== 1 ? 's' : ''}&nbsp;·&nbsp;{' '}
                {room?.memberNames?.join(', ')}
              </p>
              <p className="text-[var(--text-secondary)] text-xs mt-0.5 font-mono">
                Room code: <span className="font-black text-[var(--text-primary)] tracking-widest">{room?.code}</span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                {/* Download Report Button */}
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--nav-hover)] transition-all text-[var(--text-primary)]"
                >
                  <Download className="w-3 h-3" />
                  Download Report
                </button>

                {/* Delete button – creator only */}
                {room?.user?.toString() === currentUser?._id?.toString() && (
                  <button
                    id="delete-room-btn"
                    onClick={handleDeleteRoom}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete Room
                  </button>
                )}
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
          </div>
        </motion.div>

        {/* Live Toast */}
        <AnimatePresence>
          {liveToast && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl glass-card border border-green-500/20 bg-green-500/10 text-green-400 text-sm font-semibold flex items-center gap-2 shadow-xl"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {liveToast}
            </motion.div>
          )}
        </AnimatePresence>

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
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--nav-hover)] text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {/* Add Item Modal */}
          <AnimatePresence>
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--overlay-bg)] backdrop-blur-sm transition-colors duration-500">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="glass-card w-full max-w-md p-8 relative"
                >
                  {/* Close */}
                  <button
                    onClick={() => { setShowForm(false); setError(''); }}
                    className="absolute top-6 right-6 p-2 rounded-lg hover:bg-[var(--nav-hover)] transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
                        className="input-field"
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
                          className="input-field pl-12"
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
                        className="flex-1 px-6 py-4 rounded-xl border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] font-bold transition-all text-[var(--text-primary)]"
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
              {/* Scrollable items — Total row stays pinned below */}
              <div
                className="overflow-y-auto"
                style={{
                  maxHeight: '400px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255,255,255,0.1) transparent',
                }}
              >
                <AnimatePresence initial={false}>
                  {items.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: index < 5 ? index * 0.04 : 0 }}
                      className={`flex items-center justify-between px-6 py-4 ${
                        index !== items.length - 1
                          ? 'border-b border-[var(--glass-border)]'
                          : ''
                      } hover:bg-[var(--glass-bg)] transition-all group/row`}
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

                      {/* Right – amount + delete */}
                      <div className="flex items-center gap-3">
                        <span className="font-black text-base md:text-lg flex items-center gap-0.5">
                          <IndianRupee className="w-4 h-4 opacity-60" />
                          {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        {(item.addedBy?._id?.toString() === currentUser?._id?.toString() ||
                          room?.user?.toString() === currentUser?._id?.toString()) && (
                          <button
                            id={`delete-item-${item._id}`}
                            onClick={() => handleDeleteItem(item._id)}
                            className="opacity-0 group-hover/row:opacity-100 p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Total row — always visible, never scrolls */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--glass-border)] bg-[var(--glass-bg)]">
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
