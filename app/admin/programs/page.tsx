
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db } from '../../../services/dbService';
import { Program } from '../../../types';

export default function AdminProgramsPage() {
  const [programs] = useState<Program[]>(db.getAllPrograms());

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white">
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-8 space-y-4">
            <Link href="/admin" className="block text-xl font-bold text-blue-500 mb-8">অ্যাডমিন প্যানেল</Link>
            <Link href="/admin/programs" className="block p-3 bg-blue-600/10 rounded">কোর্সসমূহ</Link>
            <Link href="/admin/payments" className="block p-3 hover:bg-slate-800 rounded">পেমেন্ট ভেরিফিকেশন</Link>
        </aside>
        <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold mb-8">কোর্স ম্যানেজমেন্ট</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {programs.map(p => (
                    <div key={p.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                        <h3 className="font-bold mb-4">{p.title}</h3>
                        <Link href={`/admin/videos/${p.id}`} className="block text-center bg-slate-900 py-2 rounded">ভিডিও ম্যানেজমেন্ট</Link>
                    </div>
                ))}
            </div>
        </main>
    </div>
  );
}
