
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '../../services/dbService';
import { PaymentStatus, AdminNotification } from '../../types';

export default function AdminDashboardPage() {
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

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-8 space-y-4">
        <Link href="/admin" className="block text-xl font-bold text-blue-500 mb-8">অ্যাডমিন প্যানেল</Link>
        <Link href="/admin/programs" className="block p-3 hover:bg-slate-800 rounded">কোর্সসমূহ</Link>
        <Link href="/admin/payments" className="block p-3 hover:bg-slate-800 rounded">পেমেন্ট ভেরিফিকেশন</Link>
        <Link href="/" className="block p-3 hover:bg-slate-800 rounded mt-auto text-slate-500">হোমপেজ</Link>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-white">ড্যাশবোর্ড ওভারভিউ</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, i) => (
                <div key={i} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}
