
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db } from '../../../services/dbService';
import { PromoCode } from '../../../types';

export default function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>(db.getPromoCodes());
  const [newCode, setNewCode] = useState({ code: '', discount: 10 });

  const handleAdd = () => {
    if (!newCode.code) return;
    db.savePromoCode({
      id: crypto.randomUUID(),
      code: newCode.code.toUpperCase(),
      discount_percent: newCode.discount,
      max_uses: 100,
      used_count: 0,
      is_active: true,
      created_at: new Date().toISOString()
    } as any);
    setCodes(db.getPromoCodes());
    setNewCode({ code: '', discount: 10 });
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-8 space-y-4">
        <Link href="/admin" className="block text-xl font-bold text-blue-500 mb-8">অ্যাডমিন প্যানেল</Link>
        <Link href="/admin/promocodes" className="block p-3 bg-blue-600/10 rounded">প্রোমো কোড</Link>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">প্রোমো কোড ম্যানেজমেন্ট</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <h2 className="font-bold mb-4">নতুন কোড</h2>
                <div className="space-y-4">
                    <input placeholder="SAVE50" value={newCode.code} onChange={e => setNewCode({...newCode, code: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg" />
                    <input type="number" value={newCode.discount} onChange={e => setNewCode({...newCode, discount: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg" />
                    <button onClick={handleAdd} className="w-full bg-blue-600 p-3 rounded-lg font-bold">সেভ করুন</button>
                </div>
            </div>
            <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
                {codes.map(c => (
                    <div key={c.id} className="p-4 border-b border-slate-700 flex justify-between">
                        <span className="font-bold tracking-widest">{c.code}</span>
                        <span className="text-blue-400">{c.discount_percent}%</span>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}
