import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth, logout } = useAuth();

  // Restore theme from localStorage (defaults to dark)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('zentropay-theme');
    return saved ? saved === 'dark' : true;
  });

  const [activeTab, setActiveTab] = useState('home');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  // Sync active tab with location
  useEffect(() => {
    if (location.pathname === '/' || location.pathname.startsWith('/dashboard')) setActiveTab('home');
    else if (location.pathname.startsWith('/library')) setActiveTab('library');
    else if (location.pathname.startsWith('/auth')) setActiveTab('profile');
  }, [location]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply theme class + persist to localStorage
  useEffect(() => {
    if (!isDark) {
      document.documentElement.classList.add('light');
      localStorage.setItem('zentropay-theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('zentropay-theme', 'dark');
    }
  }, [isDark]);

  const dummyNotifications = [
    { id: 1, text: "Welcome to ZentroPay! Explore our new features.", time: "1h ago", read: false },
    { id: 2, text: "Your profile was updated successfully.", time: "2h ago", read: true },
    { id: 3, text: "New login from Windows device detected.", time: "1d ago", read: true }
  ];

  const navItems = [
    { 
      id: 'home', 
      icon: isAuth ? <LayoutIcon /> : <HomeIcon />, 
      label: isAuth ? 'Dashboard' : 'Home', 
      path: isAuth ? '/dashboard' : '/' 
    },
    { 
      id: 'theme', 
      icon: isDark ? <SunIcon /> : <MoonIcon />, 
      label: isDark ? 'Light Mode' : 'Dark Mode',
      onClick: () => setIsDark(!isDark)
    },
    { id: 'library', icon: <LibraryIcon />, label: 'Library', path: '/library' },
    ...(isAuth ? [{
      id: 'notifications',
      icon: <BellIcon />,
      label: 'Notifications',
      onClick: () => {
        setShowNotifications(!showNotifications);
        setShowProfileMenu(false);
      }
    }] : []),
    { 
      id: 'profile', 
      icon: <ProfileIcon />, 
      label: 'Profile',
      onClick: () => {
        setShowProfileMenu(!showProfileMenu);
        setShowNotifications(false);
      }
    }
  ];

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
      <nav 
        className="glass-nav flex items-center gap-2 px-3 py-2 rounded-full relative" 
        onMouseLeave={() => setHoveredTab(null)}
      >
        {navItems.map((item) => (
          <div key={item.id} className="relative">
            <button
              onMouseEnter={() => setHoveredTab(item.id)}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (item.path) {
                  navigate(item.path);
                  setShowProfileMenu(false);
                  setShowNotifications(false);
                } else {
                  setActiveTab(item.id);
                  setShowProfileMenu(false);
                  setShowNotifications(false);
                }
              }}
              className={`nav-item flex items-center justify-center relative z-10 w-10 h-10 ${
                activeTab === item.id || (item.id === 'profile' && showProfileMenu) || (item.id === 'notifications' && showNotifications) ? 'nav-item-active' : ''
              }`}
              aria-label={item.label}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 bg-[var(--nav-hover)] rounded-xl -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Notification dot indicator on the icon */}
              {item.id === 'notifications' && dummyNotifications.some(n => !n.read) && (
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border border-[var(--bg-primary)]" />
              )}
              
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                {item.icon}
              </motion.div>
            </button>

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredTab === item.id && !showProfileMenu && !showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-50"
                >
                  {item.label}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--text-primary)] rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Menu */}
            <AnimatePresence>
              {item.id === 'profile' && showProfileMenu && (
                <motion.div 
                  ref={menuRef}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full mb-4 right-0 w-56 glass-card rounded-3xl p-3 flex flex-col gap-1 shadow-2xl origin-bottom-right"
                >
                  {!isAuth ? (
                    <>
                      <div className="px-3 py-2 mb-1 border-b border-[var(--glass-border)]">
                        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Account</p>
                      </div>
                      <Link 
                        to="/auth/login" 
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all nav-item hover:text-[var(--accent)] hover:bg-[var(--nav-hover)]"
                      >
                        <LoginIcon /> 
                        <span>Login</span>
                      </Link>
                      <Link 
                        to="/auth/signup" 
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all bg-[var(--accent)] text-[var(--bg-primary)] hover:opacity-90 shadow-lg mt-1"
                      >
                        <SignupIcon /> 
                        <span>Create Account</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 mb-1 flex items-center gap-3 border-b border-[var(--glass-border)]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          U
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold truncate">My Account</span>
                          <span className="text-xs text-[var(--text-secondary)] truncate">Manage profile</span>
                        </div>
                      </div>
                      <Link 
                        to="/dashboard" 
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all nav-item hover:text-[var(--accent)] mt-1"
                      >
                        <LayoutIcon /> 
                        <span>Dashboard</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all hover:bg-red-500/10 hover:text-red-500 w-full text-left group mt-1"
                      >
                        <span className="text-red-500/70 group-hover:text-red-500 transition-colors">
                          <LogoutIcon />
                        </span>
                        <span>Logout</span>
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notifications Menu */}
            <AnimatePresence>
              {item.id === 'notifications' && showNotifications && (
                <motion.div 
                  ref={notifRef}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full mb-4 right-[-4rem] sm:right-[-2rem] w-[320px] max-w-[calc(100vw-2rem)] glass-card rounded-3xl p-4 flex flex-col gap-3 shadow-2xl origin-bottom"
                >
                  <div className="flex items-center justify-between px-1 pb-3 border-b border-[var(--glass-border)]">
                    <span className="font-bold text-base tracking-tight">Notifications</span>
                    {dummyNotifications.some(n => !n.read) && (
                      <span className="text-[10px] bg-blue-500 text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">
                        {dummyNotifications.filter(n => !n.read).length} New
                      </span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
                    {dummyNotifications.map(notif => (
                      <div key={notif.id} className="p-3 rounded-2xl hover:bg-[var(--nav-hover)] transition-all duration-300 cursor-pointer flex flex-col gap-1.5 group border border-transparent hover:border-[var(--glass-border)]">
                        <div className="flex items-start justify-between gap-3">
                          <p className={`text-sm leading-snug ${notif.read ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)] font-semibold'}`}>
                            {notif.text}
                          </p>
                          {!notif.read && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                        </div>
                        <span className="text-xs text-[var(--text-secondary)] font-medium group-hover:text-[var(--text-primary)] transition-colors opacity-70">
                          {notif.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        ))}
      </nav>
    </div>
  );
};

// Custom SVG Icons
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const LibraryIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SignupIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const LoginIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const LayoutIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

export default Navbar;

