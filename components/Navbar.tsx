
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../services/dbService';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const user = db.getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    db.logout();
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">A</div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">AmrCourse</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-blue-400 transition-colors">হোম</Link>
          <a href="#courses" className="hover:text-blue-400 transition-colors">কোর্সসমূহ</a>
          <a href="#about" className="hover:text-blue-400 transition-colors">আমাদের সম্পর্কে</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link 
                to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"}
                className="text-sm font-medium hover:text-blue-400 transition-colors"
              >
                {user.role === UserRole.ADMIN ? "অ্যাডমিন প্যানেল" : "ড্যাশবোর্ড"}
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all"
              >
                লগআউট
              </button>
            </>
          ) : (
            <Link 
              to="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all"
            >
              লগইন করুন
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
