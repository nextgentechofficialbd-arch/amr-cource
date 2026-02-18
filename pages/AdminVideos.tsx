
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/dbService';
import { Video, Program } from '../types';

const AdminVideos: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
        setVideos(db.getVideosForProgram(id));
        setNewVideo(prev => ({ ...prev, order_index: db.getVideosForProgram(id).length + 1 }));
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
    setNewVideo({ title: '', drive_embed_url: '', order_index: videos.length + 2 });
  };

  if (!program) return null;

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
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <Link to="/admin/programs" className="text-blue-400 text-sm mb-2 inline-block">← কোর্স তালিকায় ফিরে যান</Link>
          <h1 className="text-3xl font-bold">{program.title} - ভিডিও তালিকা</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="font-bold">আপলোড করা ভিডিও ({videos.length})</h2>
              </div>
              <div className="p-0">
                {videos.length > 0 ? (
                  <ul className="divide-y divide-slate-700">
                    {videos.map((v) => (
                      <li key={v.id} className="p-4 flex items-center justify-between hover:bg-slate-900/50 transition-all">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-full bg-slate-900 text-slate-500 flex items-center justify-center text-xs font-bold font-inter">
                            {v.order_index}
                          </span>
                          <div>
                            <p className="font-medium">{v.title}</p>
                            <p className="text-[10px] text-slate-500 truncate max-w-xs">{v.drive_embed_url}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => { db.deleteVideo(v.id); setVideos(db.getVideosForProgram(id!)); }}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          ডিলিট
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-12 text-center text-slate-500">কোনো ভিডিও যোগ করা হয়নি।</div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sticky top-8">
              <h2 className="font-bold mb-6">নতুন ভিডিও যোগ করুন</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase font-bold tracking-wider">ভিডিও শিরোনাম</label>
                  <input 
                    type="text" 
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase font-bold tracking-wider">Drive Embed URL</label>
                  <input 
                    type="text" 
                    value={newVideo.drive_embed_url}
                    onChange={(e) => setNewVideo({ ...newVideo, drive_embed_url: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none font-inter"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase font-bold tracking-wider">Order Index</label>
                  <input 
                    type="number" 
                    value={newVideo.order_index}
                    onChange={(e) => setNewVideo({ ...newVideo, order_index: parseInt(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none font-inter"
                  />
                </div>
                
                {newVideo.drive_embed_url && (
                  <div className="pt-4 border-t border-slate-700 mt-4">
                    <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase">প্ৰিভিউ</p>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-700">
                      <iframe src={newVideo.drive_embed_url} className="w-full h-full"></iframe>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleAdd}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold mt-4 transition-all"
                >
                  ভিডিও সেভ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminVideos;
