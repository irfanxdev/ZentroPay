import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isDark) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isDark]);

  const navItems = [
    { id: 'home', icon: <HomeIcon />, label: 'Home' },
    { 
      id: 'theme', 
      icon: isDark ? <SunIcon /> : <MoonIcon />, 
      label: 'Toggle Theme',
      onClick: () => setIsDark(!isDark)
    },
    { id: 'library', icon: <LibraryIcon />, label: 'Library' },
    { 
      id: 'profile', 
      icon: <ProfileIcon />, 
      label: 'Profile',
      onClick: () => setShowProfileMenu(!showProfileMenu)
    }
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav className="glass-nav flex items-center gap-2 px-3 py-2 rounded-full">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              } else {
                setActiveTab(item.id);
                setShowProfileMenu(false);
              }
            }}
            className={`nav-item flex items-center justify-center relative ${
              activeTab === item.id || (item.id === 'profile' && showProfileMenu) ? 'nav-item-active' : ''
            }`}
            aria-label={item.label}
          >
            {item.icon}
            
            {item.id === 'profile' && showProfileMenu && (
              <div 
                ref={menuRef}
                className="absolute bottom-full mb-4 right-0 w-40 glass-nav rounded-2xl p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-2xl"
              >
                <Link 
                  to="/auth/login" 
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all nav-item hover:text-[var(--accent)]"
                >
                  <LoginIcon /> Login
                </Link>
                <Link 
                  to="/auth/signup" 
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all nav-item hover:text-[var(--accent)]"
                >
                  <SignupIcon /> Signup
                </Link>
              </div>
            )}
          </button>
        ))}
        
        {/* Indicators or subtle glow effects can be added here */}
        <div 
          className="absolute -bottom-1 h-1 bg-white/20 blur-sm rounded-full transition-all duration-500"
          style={{
            width: '40px',
            left: `${navItems.findIndex(i => i.id === activeTab) * 52 + 16}px`
          }}
        />
      </nav>
    </div>
  );
};

// Custom SVG Icons to match the reference image
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
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
);

const SignupIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const LoginIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

export default Navbar;
