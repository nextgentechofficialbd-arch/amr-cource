
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/dbService';
import { generateCourseDescription } from '../services/geminiService';
import { Program } from '../types';

const AdminPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>(db.getAllPrograms());
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<Partial<Program>>({
    title: '',
    slug: '',
    short_description: '',
    description: '',
    price: 0,
    thumbnail_url: 'https://picsum.photos/800/450',
    is_active: true
  });

  const handleGenerateAI = async () => {
    if (!currentProgram.title) return alert('আগে কোর্সের শিরোনাম দিন।');
    setIsGenerating(true);
    const desc = await generateCourseDescription(currentProgram.title);
    setCurrentProgram({ ...currentProgram, description: desc });
    setIsGenerating(false);
  };

  const handleSave = () => {
    if (!currentProgram.title || !currentProgram.slug) return alert('সব তথ্য দিন।');
    const prog: Program = {
      id: currentProgram.id || crypto.randomUUID(),
      title: currentProgram.title,
      slug: currentProgram.slug,
      short_description: currentProgram.short_description || '',
      description: currentProgram.description || '',
      price: currentProgram.price || 0,
      thumbnail_url: currentProgram.thumbnail_url || '',
      is_active: currentProgram.is_active ?? true,
      order_index: programs.length + 1,
      created_at: new Date().toISOString()
    };
    db.saveProgram(prog);
    setPrograms(db.getAllPrograms());
    setIsEditing(false);
    setCurrentProgram({ title: '', slug: '', price: 0 });
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
            <Link to="/admin/programs" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-lg font-bold">
              <span>📚</span> কোর্সসমূহ
            </Link>
            <Link to="/admin/payments" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-all">
              <span>💰</span> পেমেন্ট ভেরিফিকেশন
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">কোর্স ম্যানেজমেন্ট</h1>
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all"
          >
            নতুন কোর্স যোগ করুন
          </button>
        </div>

        {isEditing ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-xl font-bold mb-6">কোর্স তথ্য</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm text-slate-400 mb-2">কোর্সের নাম</label>
                <input 
                  type="text" 
                  value={currentProgram.title}
                  onChange={(e) => setCurrentProgram({ ...currentProgram, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Slug (URL)</label>
                <input 
                  type="text" 
                  value={currentProgram.slug}
                  onChange={(e) => setCurrentProgram({ ...currentProgram, slug: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none font-inter"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">মূল্য (BDT)</label>
                <input 
                  type="number" 
                  value={currentProgram.price}
                  onChange={(e) => setCurrentProgram({ ...currentProgram, price: parseInt(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none font-inter"
                />
              </div>
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-slate-400">বিস্তারিত বিবরণ</label>
                  <button 
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full font-bold hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    {isGenerating ? 'AI জেনারেট করছে...' : '✨ AI দিয়ে বিবরণ লিখুন'}
                  </button>
                </div>
                <textarea 
                  rows={6}
                  value={currentProgram.description}
                  onChange={(e) => setCurrentProgram({ ...currentProgram, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none text-sm leading-relaxed"
                ></textarea>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-xl font-bold"
              >
                সংরক্ষণ করুন
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-2 rounded-xl font-bold"
              >
                বাতিল
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p) => (
              <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
                <img src={p.thumbnail_url} className="aspect-video object-cover" />
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-4">{p.title}</h3>
                  <div className="mt-auto flex flex-col gap-2">
                    <Link to={`/admin/videos/${p.id}`} className="block text-center bg-slate-900 hover:bg-slate-700 py-2 rounded-lg text-sm font-bold border border-slate-700">ভিডিও ম্যানেজমেন্ট</Link>
                    <button 
                      onClick={() => { setCurrentProgram(p); setIsEditing(true); }}
                      className="block text-center bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 py-2 rounded-lg text-sm font-bold border border-blue-500/20"
                    >
                      এডিট কোর্স
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPrograms;
