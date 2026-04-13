import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users } from 'lucide-react';

const CreateRoomModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    purpose: '',
    numMembers: '',
    memberNames: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    setFormData({ purpose: '', numMembers: '', memberNames: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card w-full max-w-md p-8 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-white/5 transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black mb-1">Create New Room</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-8">Set up your new expense group</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">Purpose</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Office Lunch, Rent, Trip"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:border-white/20 outline-none transition-all placeholder:opacity-20 text-[var(--text-primary)]"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">Number of Members</label>
                <div className="relative">
                  <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                  <input
                    required
                    type="number"
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-5 py-3.5 focus:border-white/20 outline-none transition-all placeholder:opacity-20 text-[var(--text-primary)]"
                    value={formData.numMembers}
                    onChange={(e) => setFormData({ ...formData, numMembers: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">Member Names</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Enter names separated by commas..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:border-white/20 outline-none transition-all placeholder:opacity-20 resize-none text-[var(--text-primary)]"
                  value={formData.memberNames}
                  onChange={(e) => setFormData({ ...formData, memberNames: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-xl border border-white/5 hover:bg-white/5 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold hover:opacity-90 transition-all shadow-xl"
                >
                  Create Room
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateRoomModal;
