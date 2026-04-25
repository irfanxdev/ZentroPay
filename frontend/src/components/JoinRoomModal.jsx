import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hash, ArrowRight, Loader2 } from 'lucide-react';

const JoinRoomModal = ({ isOpen, onClose, onJoin }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // allow only single digit or empty
    setError('');
    const updated = [...code];
    updated[index] = value;
    setCode(updated);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const updated = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) updated[i] = pasted[i];
    setCode(updated);
    const nextEmpty = updated.findIndex((v) => v === '');
    const focusIndex = nextEmpty === -1 ? 3 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomCode = code.join('');
    if (roomCode.length < 4) {
      setError('Please enter the full 4-digit room code.');
      return;
    }
    setLoading(true);
    try {
      await onJoin(roomCode);
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid room code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode(['', '', '', '']);
    setError('');
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--overlay-bg)] backdrop-blur-sm transition-colors duration-500">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="glass-card w-full max-w-sm p-6 sm:p-8 relative"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-[var(--nav-hover)] transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] flex items-center justify-center">
                <Hash className="w-5 h-5 opacity-50" />
              </div>
              <div>
                <h2 className="text-2xl font-black leading-tight">Join a Room</h2>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-8 pl-0">
              Enter the 4-digit code shared by your room creator.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 4-digit OTP inputs */}
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`
                      w-12 h-12 sm:w-16 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl
                      border transition-all outline-none
                      bg-[var(--glass-bg)] text-[var(--text-primary)]
                      ${digit
                        ? 'border-[var(--text-primary)] shadow-[0_0_0_2px_var(--glass-border)]'
                        : 'border-[var(--glass-border)]'
                      }
                      focus:border-[var(--text-primary)] focus:shadow-[0_0_0_2px_var(--glass-border)]
                      placeholder:opacity-20
                    `}
                    placeholder="·"
                  />
                ))}
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-center text-xs font-semibold text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-4 rounded-xl border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] font-bold transition-all text-[var(--text-primary)] text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Join Room
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
                      
export default JoinRoomModal;
