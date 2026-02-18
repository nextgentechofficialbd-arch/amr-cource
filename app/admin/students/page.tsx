
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db } from '../../../services/dbService';
import { Student } from '../../../types';

export default function AdminStudentsPage() {
  const [students] = useState<Student[]>(db.getAllStudents());

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-8 space-y-4">
        <Link href="/admin" className="block text-xl font-bold text-blue-500 mb-8">অ্যাডমিন প্যানেল</Link>
        <Link href="/admin/students" className="block p-3 bg-blue-600/10 rounded">স্টুডেন্ট লিস্ট</Link>
        <Link href="/admin/programs" className="block p-3 hover:bg-slate-800 rounded">কোর্সসমূহ</Link>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">নিবন্ধিত স্টুডেন্ট</h1>
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-500 text-xs uppercase">
                    <tr>
                        <th className="p-4">নাম</th>
                        <th className="p-4">ইমেইল</th>
                        <th className="p-4">ফোন</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {students.map(s => (
                        <tr key={s.id}>
                            <td className="p-4">{s.full_name}</td>
                            <td className="p-4 text-slate-400">{s.email}</td>
                            <td className="p-4">{s.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </main>
    </div>
  );
}
