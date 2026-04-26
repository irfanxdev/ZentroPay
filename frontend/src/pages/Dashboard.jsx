import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  UserPlus,
  History,
  ChevronRight,
  Users,
  Trash2,
} from 'lucide-react';

import API from '../api/api.js';
import CreateRoomModal from '../components/CreateRoomModal';
import JoinRoomModal from '../components/JoinRoomModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const fetchRooms = async () => {
    const resRoom = await API.get("/room/all");
    setRooms(resRoom.data.rooms);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/auth/dashboard');
        setUser(res.data.user);
        await fetchRooms();
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateRoom = async (data) => {
    try {
      await API.post("/room/create", data);
      setIsModalOpen(false);
      await fetchRooms(); // refresh list so new room appears
    } catch (error) {
      console.log("Failed to send the Room create data", error);
    }
  };

  const handleJoinRoom = async (roomCode) => {
    // Throws on error so JoinRoomModal displays the error message
    await API.post("/room/join", { code: roomCode });
    await fetchRooms(); // refresh list so joined room appears in dashboard
    setIsJoinModalOpen(false);
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room? This will also delete all items inside it.')) return;
    try {
      await API.delete(`/room/${roomId}`);
      setRooms((prev) => prev.filter((r) => r._id !== roomId));
    } catch (err) {
      alert(err?.response?.data?.msg || 'Failed to delete room');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--glass-border)] border-t-[var(--text-primary)] rounded-full animate-spin"></div>
      </div>
    )
  }

  const transactions = [
    { id: 1, name: 'Apple Store', type: 'expense', amount: 999.00, date: 'Today, 2:45 PM', category: 'Electronics' },
    { id: 2, name: 'Salary Deposit', type: 'income', amount: 4500.00, date: 'Yesterday', category: 'Work' },
    { id: 3, name: 'Netflix Subscription', type: 'expense', amount: 15.99, date: 'Oct 8, 2023', category: 'Entertainment' },
    { id: 4, name: 'Starbucks Coffee', type: 'expense', amount: 6.50, date: 'Oct 7, 2023', category: 'Food' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 md:p-8 pt-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome back, <span className="opacity-80">{user?.name || 'User'}</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-sm md:text-base font-medium">Here's what's happening with your accounts today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-none px-4 md:px-5 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--nav-hover)] transition-all text-xs md:text-sm font-bold flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New
            </button>
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="flex-1 sm:flex-none px-4 md:px-5 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--nav-hover)] transition-all text-xs md:text-sm font-bold flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add existing
            </button>
          </div>
        </header>

        <CreateRoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateRoom}
        />

        <JoinRoomModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          onJoin={handleJoinRoom}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6">

          {/* Main Balance Card – shows latest room */}
          {rooms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 md:p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <Wallet className="w-32 h-32 md:w-48 h-48" />
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between gap-8 md:gap-12">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs md:text-sm font-bold opacity-40 uppercase tracking-[0.2em] mb-2">{rooms[0].purpose}</p>
                    <p className="text-xs md:text-sm font-bold opacity-40 uppercase tracking-[0.2em] mb-2">{rooms[0].member} Members</p>
                  </div>
                  <button
                    onClick={() => navigate(`/room/${rooms[0]._id}`)}
                    className="text-[10px] md:text-xs font-bold opacity-60 hover:opacity-100 transition-all flex items-center gap-1 group/btn"
                  >
                    View Detail
                    <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 md:pt-8 border-t border-[var(--glass-border)]">
                  <div className="space-y-1">
                    <p className="text-[10px] md:text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Members</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl md:text-2xl font-black">{rooms[0].memberNames?.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* Transactions Section */}
        <div className="grid grid-cols-1 gap-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card overflow-hidden"
          >
            <div className="p-6 md:p-8 border-b border-[var(--glass-border)] flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5 opacity-40" />
                Recent Activity
              </h3>
              <button className="text-xs md:text-sm font-bold hover:underline transition-all">View all</button>
            </div>
            <div className="divide-y divide-[var(--glass-border)]">
              {rooms.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)] text-sm">
                  No rooms yet. Create one to get started!
                </div>
              ) : (
                rooms.map((room, index) => (
                  <motion.div
                    key={room._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between px-6 md:px-8 py-4 hover:bg-[var(--glass-bg)] transition-all group/row"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl border border-[var(--glass-border)] flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 opacity-40" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm md:text-base">{room.purpose}</p>
                        <p className="text-[var(--text-secondary)] text-xs mt-0.5">
                          {room.member} member{room.member !== 1 ? 's' : ''} · {room.memberNames?.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/room/${room._id}`)}
                        className="text-[10px] md:text-xs font-bold opacity-50 hover:opacity-100 transition-all flex items-center gap-1 group/btn"
                      >
                        View Detail
                        <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                      {room.user === user?._id && (
                        <button
                          id={`delete-room-${room._id}`}
                          onClick={() => handleDeleteRoom(room._id)}
                          className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          title="Delete room"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>



        </div>
      </div>
    </div>
  );
};

export default Dashboard;
