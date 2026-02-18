
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/dbService';
import { PromoCode } from '../types';

const AdminPromoCodes: React.FC = () => {
  const [codes, setCodes] = useState<PromoCode[]>(db.getPromoCodes());
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<PromoCode>>({
    code: '',
    discount_percent: 10,
    max_uses: 100,
    is_active: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discount_percent) return;
    
    const newCode: PromoCode = {
      id: crypto.randomUUID(),
      code: formData.code.toUpperCase(),
      discount_percent: formData.discount_percent,
      max_uses: formData.max_uses || 100,
      used_count: 0,
      is_active: formData.is_active ?? true,
      expires_at: formData.expires_at
    };

    db.savePromoCode(newCode);
    setCodes(db.getPromoCodes());
    setIsAdding(false);
    setFormData({ code: '', discount_percent: 10, max_uses: 100, is_active: true });
  };

  const handleToggle = (id: string) => {
    db.togglePromoCode(id);
    setCodes([...db.getPromoCodes()]);
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A]">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:block shrink-0">
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
            <Link to="/admin/payments" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-all">
              <span>💰</span> পেমেন্ট ভেরিফিকেশন
            </Link>
            <Link to="/admin/students" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-all">
              <span>👥</span> স্টুডেন্ট লিস্ট
            </Link>
            <Link to="/admin/promocodes" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-lg font-bold">
              <span>🎟️</span> প্রোমো কোড
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">প্রোমো কোড ম্যানেজমেন্ট</h1>
            <p className="text-slate-400">কোর্সের জন্য ডিসকাউন্ট কোড তৈরি ও নিয়ন্ত্রণ করুন</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20"
          >
            নতুন কোড তৈরি করুন
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/50 text-slate-500 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4">কোড</th>
                      <th className="px-6 py-4">ডিসকাউন্ট</th>
                      <th className="px-6 py-4">ব্যবহার (Used/Max)</th>
                      <th className="px-6 py-4">অবস্থা</th>
                      <th className="px-6 py-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {codes.map((code) => (
                      <tr key={code.id} className="text-sm">
                        <td className="px-6 py-5 font-bold font-inter tracking-widest text-white">
                          {code.code}
                        </td>
                        <td className="px-6 py-5 text-blue-400 font-bold font-inter">
                          {code.discount_percent}%
                        </td>
                        <td className="px-6 py-5 font-inter text-slate-400">
                          {code.used_count} / {code.max_uses}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${code.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {code.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => handleToggle(code.id)}
                            className="text-xs text-slate-400 hover:text-white underline"
                          >
                            {code.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {isAdding ? (
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sticky top-8 animate-in slide-in-from-right-4">
                <h2 className="text-lg font-bold mb-6">নতুন প্রোমো কোড</h2>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 uppercase font-bold tracking-widest">কোড নাম</label>
                    <input 
                      required
                      type="text" 
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="যেমন: SAVE20"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 font-inter"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 uppercase font-bold tracking-widest">ডিসকাউন্ট (%)</label>
                    <input 
                      required
                      type="number" 
                      value={formData.discount_percent}
                      onChange={(e) => setFormData({ ...formData, discount_percent: parseInt(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none font-inter"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 uppercase font-bold tracking-widest">সর্বোচ্চ ব্যবহার</label>
                    <input 
                      type="number" 
                      value={formData.max_uses}
                      onChange={(e) => setFormData({ ...formData, max_uses: parseInt(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none font-inter"
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition-all">সেভ করুন</button>
                    <button type="button" onClick={() => setIsAdding(false)} className="px-6 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-bold">বাতিল</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-8 text-center sticky top-8">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xl font-bold mb-3">ডিসকাউন্ট দিন</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">উৎসব বা বিশেষ দিনে স্টুডেন্টদের জন্য প্রোমো কোড তৈরি করুন এবং সেলস বৃদ্ধি করুন।</p>
                <button onClick={() => setIsAdding(true)} className="text-blue-400 font-bold hover:underline">নতুন কোড এড করুন</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPromoCodes;
