import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Mock components for routes
const LandingPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
    {/* Decorative background elements */}
    <div className="glow-overlay absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px]" />
    <div className="glow-overlay absolute bottom-1/4 -right-20 w-80 h-80 bg-white/5 rounded-full blur-[120px]" />

    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white opacity-90 select-none">
      GOOD TASTE
    </h1>
    
    <p className="mt-4 text-white/40 font-medium tracking-widest uppercase text-sm">
      Experience the premium interface
    </p>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;