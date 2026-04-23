import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const CreateRoomModal = ({ isOpen, onClose, onCreate }) => {
  const [purpose, setPurpose] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ purpose });
    setPurpose('');
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
            <p className="text-[var(--text-secondary)] text-sm mb-8">
              Set up your new expense group — share the code to invite members.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">
                  Purpose
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Office Lunch, Rent, Trip"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:border-white/20 outline-none transition-all placeholder:opacity-20 text-[var(--text-primary)]"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
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
