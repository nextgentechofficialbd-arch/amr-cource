
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db } from '../../../services/dbService';
import { Payment } from '../../../types';
import toast from 'react-hot-toast';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(db.getPendingPayments());

  const handleApprove = (id: string) => {
    db.approvePayment(id);
    setPayments(db.getPendingPayments());
    toast.success('পেমেন্ট অ্যাপ্রুভ করা হয়েছে।');
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white">
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-8 space-y-4">
            <Link href="/admin" className="block text-xl font-bold text-blue-500 mb-8">অ্যাডমিন প্যানেল</Link>
            <Link href="/admin/programs" className="block p-3 hover:bg-slate-800 rounded">কোর্সসমূহ</Link>
            <Link href="/admin/payments" className="block p-3 bg-blue-600/10 rounded">পেমেন্ট ভেরিফিকেশন</Link>
        </aside>
        <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold mb-8">পেমেন্ট ভেরিফিকেশন</h1>
            <div className="bg-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-500 text-sm">
                        <tr>
                            <th className="p-4">TrxID</th>
                            <th className="p-4">টাকা</th>
                            <th className="p-4">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p.id} className="border-t border-slate-700">
                                <td className="p-4">{p.bkash_trx_id}</td>
                                <td className="p-4">৳{p.amount}</td>
                                <td className="p-4">
                                    <button onClick={() => handleApprove(p.id)} className="bg-green-600 px-4 py-2 rounded font-bold">Approve</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    </div>
  );
}
