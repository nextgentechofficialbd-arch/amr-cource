
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { db } from '../services/dbService';
import { Video, Program } from '../types';

const CoursePlayer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const user = db.getCurrentUser();
  const [program, setProgram] = useState<Program | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [progressIds, setProgressIds] = useState<string[]>([]);

  useEffect(() => {
    if (slug && user) {
      const p = db.getProgramBySlug(slug);
      if (p) {
        setProgram(p);
        const vList = db.getVideosForProgram(p.id);
        setVideos(vList);
        if (vList.length > 0) setActiveVideo(vList[0]);
        
        const prog = db.getProgress(user.id, p.id);
        setProgressIds(prog.map(vp => vp.video_id));
      }
    }
  }, [slug, user]);

  if (!user) return <Navigate to="/login" />;
  if (!program) return <div className="p-20 text-center">Loading...</div>;

  const handleMarkComplete = () => {
    if (activeVideo && user && program) {
      db.markVideoComplete(user.id, program.id, activeVideo.id);
      setProgressIds([...progressIds, activeVideo.id]);
    }
  };

  const isCompleted = (vId: string) => progressIds.includes(vId);

  return (
    <div className="flex flex-col h-screen bg-[#0F172A]">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div>
            <h1 className="font-bold text-lg leading-none">{program.title}</h1>
            <p className="text-slate-500 text-xs mt-1">
              {progressIds.length} / {videos.length} ভিডিও সম্পন্ন হয়েছে
            </p>
          </div>
        </div>
        <div className="hidden md:block w-64 bg-slate-800 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${(progressIds.length / videos.length) * 100}%` }}
          ></div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Player Area */}
        <div className="flex-1 overflow-y-auto bg-black flex flex-col">
          {activeVideo ? (
            <>
              <div className="aspect-video bg-slate-900 w-full relative">
                <iframe 
                  src={activeVideo.drive_embed_url} 
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-8 bg-[#0F172A]">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{activeVideo.title}</h2>
                    <p className="text-slate-400">মডিউল {activeVideo.order_index}</p>
                  </div>
                  <button 
                    onClick={handleMarkComplete}
                    disabled={isCompleted(activeVideo.id)}
                    className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${
                      isCompleted(activeVideo.id) 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-default' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20'
                    }`}
                  >
                    {isCompleted(activeVideo.id) ? (
                      <><span className="text-lg">✓</span> সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে</>
                    ) : (
                      'সম্পন্ন হিসেবে চিহ্নিত করুন'
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              কোনো ভিডিও নির্বাচিত হয়নি।
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-80 md:w-96 bg-slate-900 border-l border-slate-800 overflow-y-auto shrink-0 hidden lg:block">
          <div className="p-6">
            <h3 className="font-bold text-slate-400 text-sm uppercase tracking-widest mb-6">ভিডিও তালিকা</h3>
            <div className="space-y-2">
              {videos.map((v) => (
                <button 
                  key={v.id} 
                  onClick={() => setActiveVideo(v)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all text-left ${
                    activeVideo?.id === v.id ? 'bg-blue-600/10 border border-blue-500/30' : 'hover:bg-slate-800'
                  }`}
                >
                  <div className={`mt-0.5 w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-inter font-bold ${
                    isCompleted(v.id) ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isCompleted(v.id) ? '✓' : v.order_index}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-sm font-medium line-clamp-2 ${activeVideo?.id === v.id ? 'text-blue-400' : 'text-slate-200'}`}>
                      {v.title}
                    </p>
                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter mt-1 block">VIDEO MODULE</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoursePlayer;
