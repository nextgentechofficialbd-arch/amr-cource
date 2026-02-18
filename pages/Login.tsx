
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../services/dbService';
import { Student, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: Student) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = db.login(email);
    if (user) {
      onLogin(user);
      if (user.role === UserRole.ADMIN) navigate('/admin');
      else navigate('/dashboard');
    } else {
      setError('ইউজার পাওয়া যায়নি। দয়া করে সঠিক ইমেইল দিন।');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl shadow-xl shadow-blue-500/20">A</div>
            <span className="text-3xl font-bold tracking-tight">AmrCourse</span>
          </Link>
          <h1 className="text-2xl font-bold">একাউন্টে লগইন করুন</h1>
          <p className="text-slate-400 mt-2">আপনার ইমেইল দিয়ে লগইন করে শেখা শুরু করুন</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">ইমেইল এড্রেস</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>
            
            {error && <p className="text-red-400 text-sm text-center font-medium bg-red-400/10 p-3 rounded-lg">{error}</p>}

            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]">
              লগইন করুন
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700 text-center">
            <p className="text-slate-500 text-sm">
              অ্যাডমিন হলে <span className="text-blue-400 font-bold">admin@amrcourse.com</span> দিয়ে লগইন করুন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
