
import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/dbService';
import { PaymentStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const programs = db.getAllPrograms();
  const payments = db.getPendingPayments();
  const allPayments = (db as any).payments || []; // Accessing private for demo stats

  const totalRevenue = allPayments
    .filter((p: any) => p.status === PaymentStatus.APPROVED)
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  const stats = [
    { label: 'মোট কোর্স', value: programs.length, color: 'bg-blue-600' },
    { label: 'পেন্ডিং পেমেন্ট', value: payments.length, color: 'bg-orange-500' },
    { label: 'মোট রেভিনিউ', value: `৳${totalRevenue}`, color: 'bg-green-600' },
    { label: 'মোট ট্রানজেকশন', value: allPayments.length, color: 'bg-purple-600' }
  ];

  return (
    <div className="flex min-h-screen bg-[#0F172A]">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:block">
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
            <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-all mt-10">
              <span>🏠</span> ওয়েবসাইট দেখুন
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">ড্যাশবোর্ড ওভারভিউ</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">{stat.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold font-inter">{stat.value}</span>
                <div className={`w-10 h-10 rounded-lg ${stat.color} opacity-20`}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="font-bold">সাম্প্রতিক পেন্ডিং পেমেন্ট</h2>
              <Link to="/admin/payments" className="text-sm text-blue-400 hover:underline">সবগুলো দেখুন</Link>
            </div>
            <div className="p-0">
              {payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-slate-500 text-xs uppercase tracking-tighter">
                      <tr>
                        <th className="px-6 py-3">ইমেইল</th>
                        <th className="px-6 py-3">TrxID</th>
                        <th className="px-6 py-3">অ্যামাউন্ট</th>
                        <th className="px-6 py-3">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {payments.slice(0, 5).map((p) => (
                        <tr key={p.id} className="text-sm">
                          <td className="px-6 py-4 truncate max-w-[150px]">
                            {p.student_id.slice(0, 8)}...
                          </td>
                          <td className="px-6 py-4 font-inter text-xs">{p.bkash_trx_id}</td>
                          <td className="px-6 py-4 font-inter">৳{p.amount}</td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => { db.approvePayment(p.id); window.location.reload(); }}
                              className="text-green-500 hover:text-green-400 font-bold"
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-20 text-center text-slate-500">কোনো পেন্ডিং পেমেন্ট নেই।</div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-600/10 text-blue-400 rounded-full flex items-center justify-center text-2xl mb-4">✨</div>
            <h3 className="text-xl font-bold mb-2">দ্রুত কোর্স তৈরি করুন</h3>
            <p className="text-slate-400 mb-6 max-w-xs">AI ব্যবহার করে দ্রুত কোর্সের ডেসক্রিপশন জেনারেট করুন এবং কোর্স লাইভ করুন।</p>
            <Link to="/admin/programs" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all">কোর্স ম্যানেজ করুন</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
