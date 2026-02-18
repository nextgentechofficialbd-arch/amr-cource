
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/dbService';
import { Payment } from '../types';
import toast from 'react-hot-toast';

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(db.getPendingPayments());
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleApprove = (id: string) => {
    const paymentNote = notes[id] || '';
    db.approvePayment(id, paymentNote);
    setPayments(db.getPendingPayments());
    toast.success('পেমেন্ট অ্যাপ্রুভ করা হয়েছে।');
  };

  const handleReject = (id: string) => {
    const paymentNote = notes[id] || '';
    db.rejectPayment(id, paymentNote);
    setPayments(db.getPendingPayments());
    toast.error('পেমেন্ট রিজেক্ট করা হয়েছে।');
  };

  const handleNoteChange = (id: string, value: string) => {
    setNotes(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A]">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:block">
        <div className="p-8">
          <Link to="/admin" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">A</div>
            <span className="font-bold">অ্যাডমিন প্যানেল</span>
          </Link>
          <nav className="space-y-1">
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-all">
              <span>📊</span> ড্যাশবোর্ড
            </Link>
            <Link to="/admin/programs" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-all">
              <span>📚</span> কোর্সসমূহ
            </Link>
            <Link to="/admin/payments" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-lg font-bold">
              <span>💰</span> পেমেন্ট ভেরিফিকেশন
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">পেমেন্ট ভেরিফিকেশন</h1>
        
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-700">
            <h2 className="font-bold">পেন্ডিং তালিকা ({payments.length})</h2>
          </div>
          <div className="p-0">
            {payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/50 text-slate-500 text-xs uppercase tracking-tighter">
                    <tr>
                      <th className="px-6 py-4">স্টুডেন্ট আইডি</th>
                      <th className="px-6 py-4">bKash TrxID</th>
                      <th className="px-6 py-4 font-inter">টাকার পরিমাণ</th>
                      <th className="px-6 py-4">নোটস (ঐচ্ছিক)</th>
                      <th className="px-6 py-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {payments.map((p) => (
                      <tr key={p.id} className="text-sm hover:bg-slate-900/30 transition-all">
                        <td className="px-6 py-4 font-inter text-slate-300">
                          {p.student_id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-900 text-slate-100 font-inter px-2 py-1 rounded text-xs tracking-wider border border-slate-700">{p.bkash_trx_id}</span>
                        </td>
                        <td className="px-6 py-4 font-bold font-inter text-blue-400">
                          ৳{p.amount}
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="text" 
                            placeholder="যেমন: সঠিক ট্রানজেকশন"
                            value={notes[p.id] || ''}
                            onChange={(e) => handleNoteChange(p.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 text-right flex gap-3 justify-end items-center">
                          <button 
                            onClick={() => handleApprove(p.id)}
                            className="bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all border border-green-500/20"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(p.id)}
                            className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all border border-red-500/20"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-3xl mb-4">✅</div>
                <h3 className="font-bold text-lg mb-1">কোনো পেন্ডিং পেমেন্ট নেই</h3>
                <p className="text-slate-500">সব স্টুডেন্টকে এক্সেস দেওয়া হয়ে গেছে!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPayments;
