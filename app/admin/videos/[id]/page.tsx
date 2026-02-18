
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { db } from '../../../../services/dbService';
import { Video, Program } from '../../../../types';

export default function AdminVideosPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [program, setProgram] = useState<Program | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [newVideo, setNewVideo] = useState<Partial<Video>>({
    title: '',
    drive_embed_url: '',
    order_index: 1
  });

  useEffect(() => {
    if (id) {
      const p = db.getProgramById(id);
      if (p) {
        setProgram(p);
        const vList = db.getVideosForProgram(id);
        setVideos(vList);
        setNewVideo(prev => ({ ...prev, order_index: vList.length + 1 }));
      }
    }
  }, [id]);

  const handleAdd = () => {
    if (!id || !newVideo.title || !newVideo.drive_embed_url) return alert('সব তথ্য দিন।');
    const v: Video = {
      id: crypto.randomUUID(),
      program_id: id,
      title: newVideo.title,
      drive_embed_url: newVideo.drive_embed_url,
      order_index: newVideo.order_index || 1
    };
    db.saveVideo(v);
    setVideos(db.getVideosForProgram(id));
    setNewVideo({ title: '', drive_embed_url: '', order_index: db.getVideosForProgram(id).length + 1 });
  };

  if (!program) return null;

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-8 space-y-4">
        <Link href="/admin" className="block text-xl font-bold text-blue-500 mb-8">অ্যাডমিন প্যানেল</Link>
        <Link href="/admin/programs" className="block p-3 bg-blue-600/10 rounded">কোর্সসমূহ</Link>
        <Link href="/admin/payments" className="block p-3 hover:bg-slate-800 rounded">পেমেন্ট ভেরিফিকেশন</Link>
      </aside>
      <main className="flex-1 p-8">
        <div className="mb-8">
          <Link href="/admin/programs" className="text-blue-400 text-sm mb-2 inline-block">← কোর্স তালিকায় ফিরে যান</Link>
          <h1 className="text-3xl font-bold">{program.title} - ভিডিও তালিকা</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
             <div className="p-6 border-b border-slate-700 font-bold">আপলোড করা ভিডিও ({videos.length})</div>
             <div className="p-0">
                {videos.map(v => (
                    <div key={v.id} className="p-4 border-b border-slate-700 flex justify-between items-center">
                        <span>{v.order_index}. {v.title}</span>
                        <button onClick={() => { db.deleteVideo(v.id); setVideos(db.getVideosForProgram(id!)); }} className="text-red-400 text-xs">Delete</button>
                    </div>
                ))}
             </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
             <h2 className="font-bold mb-4">নতুন ভিডিও যোগ করুন</h2>
             <div className="space-y-4">
                <input placeholder="ভিডিও শিরোনাম" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg" />
                <input placeholder="Drive Embed URL" value={newVideo.drive_embed_url} onChange={e => setNewVideo({...newVideo, drive_embed_url: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg" />
                <button onClick={handleAdd} className="w-full bg-blue-600 p-3 rounded-lg font-bold">যোগ করুন</button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
