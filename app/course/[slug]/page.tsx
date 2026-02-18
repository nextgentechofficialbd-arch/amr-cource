
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '../../../services/dbService';
import { Video, Program } from '../../../types';

export default function CoursePlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [progressIds, setProgressIds] = useState<string[]>([]);

  useEffect(() => {
    const currentUser = db.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    if (slug) {
      const p = db.getProgramBySlug(slug);
      if (p) {
        setProgram(p);
        const vList = db.getVideosForProgram(p.id);
        setVideos(vList);
        if (vList.length > 0) setActiveVideo(vList[0]);
        
        const prog = db.getProgress(currentUser.id, p.id);
        setProgressIds(prog.map(vp => vp.video_id));
      }
    }
  }, [slug, router]);

  const handleMarkComplete = () => {
    if (activeVideo && user && program) {
      db.markVideoComplete(user.id, program.id, activeVideo.id);
      setProgressIds(prev => [...prev, activeVideo.id]);
    }
  };

  if (!program || !user) return <div className="p-20 text-center text-white bg-[#0F172A] min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] text-white">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all">
            <span>←</span> {program.title}
        </Link>
        <span className="text-sm text-slate-500">{progressIds.length} / {videos.length} সম্পন্ন</span>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 bg-black flex flex-col">
            {activeVideo && (
                <div className="aspect-video w-full">
                    <iframe src={activeVideo.drive_embed_url} className="w-full h-full" allowFullScreen />
                </div>
            )}
            <div className="p-8 flex justify-between items-center bg-slate-900/50 border-t border-slate-800">
                <h2 className="text-2xl font-bold">{activeVideo?.title}</h2>
                <button 
                  onClick={handleMarkComplete} 
                  className={`px-6 py-2 rounded-xl font-bold ${progressIds.includes(activeVideo?.id || '') ? 'bg-green-600/10 text-green-500' : 'bg-blue-600'}`}
                >
                    {progressIds.includes(activeVideo?.id || '') ? 'সম্পন্ন' : 'সম্পন্ন চিহ্নিত করুন'}
                </button>
            </div>
        </div>
        <aside className="w-80 bg-slate-900 border-l border-slate-800 overflow-y-auto hidden lg:block">
            <div className="p-4 space-y-2">
                {videos.map(v => (
                    <button 
                      key={v.id} 
                      onClick={() => setActiveVideo(v)}
                      className={`w-full text-left p-4 rounded-xl transition-all ${activeVideo?.id === v.id ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400' : 'hover:bg-slate-800'}`}
                    >
                        <p className="text-sm font-medium">{v.order_index}. {v.title}</p>
                    </button>
                ))}
            </div>
        </aside>
      </div>
    </div>
  );
}
