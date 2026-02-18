
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/dbService';
import { PaymentStatus, AdminNotification } from '../types';

const AdminDashboard: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  
  useEffect(() => {
    setNotifications(db.getAdminNotifications());
  }, []);

  const programs = db.getAllPrograms();
  const students = db.getAllStudents();
  const payments = db.getPendingPayments();
  const allPayments = db.payments || [];

  const totalRevenue = allPayments
    .filter((p: any) => p.status === PaymentStatus.APPROVED)
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  const stats = [
    { label: 'মোট রেভিনিউ', value: `৳${totalRevenue}`, color: 'bg-green-600', icon: '💰' },
    { label: 'মোট স্টুডেন্ট', value: students.length, color: 'bg-blue-600', icon: '👥' },
    { label: 'পেন্ডিং পেমেন্ট', value: payments.length, color: 'bg-orange-500', icon: '⏳' },
    { label: 'মোট কোর্স', value: programs.length, color: 'bg-purple-600', icon: '📚' }
  ];

  const handleClearNotifications = () => {
    db.markNotificationsRead();
    setNotifications([...db.getAdminNotifications()]);
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A]">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:block shrink-0">
        <div className="p-8">
          <Link to="/admin" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">A</div>
            <span className="font-bold">অ্যাডমিন প্যানেল</span>
          </Link>
          <nav className="space-y-1">
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-lg font-bold">
              <span>📊</span> ড্যাশবোর্ড
            </Link>
            <Link to="/admin/programs" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-all">
              <span>📚</span> কোর্সসমূহ
            </Link>
            <Link to="/admin/payments" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-all">
              <span>💰</span> পেমেন্ট ভেরিফিকেশন
            </Link>
            <Link to="/admin/students" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-all">
              <span>👥</span> স্টুডেন্ট লিস্ট
            </Link>
            <Link to="/admin/promocodes" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-all">
              <span>🎟️</span> প্রোমো কোড
            </Link>
            <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-all mt-10 opacity-60">
              <span>🏠</span> ওয়েবসাইট ভিউ
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">স্বাগতম, অ্যাডমিন!</h1>
            <p className="text-slate-400">আজকের প্ল্যাটফর্ম পারফরম্যান্স দেখে নিন।</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-800 p-2 rounded-2xl border border-slate-700">
             <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold">A</div>
             <div className="pr-4">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">রোল</p>
                <p className="text-sm font-bold text-white">Super Admin</p>
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-xl hover:border-blue-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                 <span className="text-3xl">{stat.icon}</span>
                 <div className={`w-12 h-12 rounded-2xl ${stat.color} opacity-10 group-hover:opacity-20 transition-all`}></div>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <span className="text-4xl font-bold font-inter tracking-tight text-white">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Payments */}
            <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-700 flex justify-between items-center bg-slate-900/20">
                <h2 className="text-xl font-bold text-white">সাম্প্রতিক পেমেন্ট রিকোয়েস্ট</h2>
                <Link to="/admin/payments" className="text-sm text-blue-400 hover:underline font-bold">সবগুলো দেখুন →</Link>
              </div>
              <div className="p-0">
                {payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                        <tr>
                          <th className="px-8 py-4">স্টুডেন্ট আইডি</th>
                          <th className="px-8 py-4">TrxID</th>
                          <th className="px-8 py-4">অ্যামাউন্ট</th>
                          <th className="px-8 py-4 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {payments.slice(0, 5).map((p) => (
                          <tr key={p.id} className="text-sm hover:bg-white/5 transition-all">
                            <td className="px-8 py-5 text-slate-300 font-inter">
                               {p.student_id.slice(0, 12)}...
                            </td>
                            <td className="px-8 py-5">
                              <span className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 font-inter text-xs tracking-wider text-white">{p.bkash_trx_id}</span>
                            </td>
                            <td className="px-8 py-5 font-bold font-inter text-blue-400">৳{p.amount}</td>
                            <td className="px-8 py-5 text-right">
                              <Link 
                                to="/admin/payments"
                                className="bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white px-5 py-2 rounded-xl text-xs font-bold transition-all"
                              >
                                Review
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-24 text-center text-slate-500 flex flex-col items-center">
                     <div className="text-5xl mb-4">🚀</div>
                     <p className="font-bold text-lg text-white">সব পেমেন্ট ক্লিয়ার!</p>
                     <p className="text-sm mt-1">এখনও কোনো নতুন পেন্ডিং রিকোয়েস্ট নেই।</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notifications Feed */}
            <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-700 flex justify-between items-center bg-slate-900/20">
                <h2 className="text-xl font-bold text-white">সিস্টেম নোটিফিকেশন</h2>
                <button 
                  onClick={handleClearNotifications}
                  className="text-xs text-slate-500 hover:text-white transition-colors"
                >
                  সবগুলো পড়া হয়েছে হিসেবে চিহ্নিত করুন
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-4 rounded-2xl border flex gap-4 items-start transition-all ${
                        n.is_read ? 'bg-slate-900/30 border-slate-800' : 'bg-blue-600/5 border-blue-500/20 shadow-lg shadow-blue-500/5'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                        n.type === 'success' ? 'bg-green-500' : 
                        n.type === 'error' ? 'bg-red-500' : 
                        n.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className={`text-sm ${n.is_read ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>{n.message}</p>
                        <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest font-inter">
                          {new Date(n.created_at).toLocaleString('bn-BD')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-500">
                    <p>কোনো নোটিফিকেশন নেই।</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
             <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">কোর্স লাইভ করুন</h3>
                <p className="text-white/80 mb-8 text-sm leading-relaxed relative z-10">নতুন কোনো কোর্স তৈরি বা এডিট করতে চান? সরাসরি কোর্স ম্যানেজমেন্টে চলে যান।</p>
                <Link to="/admin/programs" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold shadow-xl relative z-10 transition-all hover:-translate-y-1">কোর্স যোগ করুন</Link>
             </div>
             
             <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-xl">
                <h3 className="font-bold mb-6 flex items-center gap-2 text-white">
                   <span className="text-xl">📊</span> কুইক সেটিংস
                </h3>
                <div className="space-y-4">
                   <Link to="/admin/promocodes" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-all">
                      <span className="text-sm font-bold text-slate-300">নতুন প্রোমো কোড</span>
                      <span className="text-blue-400">→</span>
                   </Link>
                   <Link to="/admin/students" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-all">
                      <span className="text-sm font-bold text-slate-300">স্টুডেন্ট ডাটাবেস</span>
                      <span className="text-blue-400">→</span>
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
