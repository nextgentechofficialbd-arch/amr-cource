
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { db } from '../services/dbService';

const StudentDashboard: React.FC = () => {
  const user = db.getCurrentUser();
  const enrolledPrograms = user ? db.getEnrolledPrograms(user.id) : [];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-2">স্বাগতম, {user?.full_name}! 👋</h1>
          <p className="text-slate-400">আপনার কোর্সের অগ্রগতি দেখে নিন এবং শেখা চালিয়ে যান।</p>
        </header>

        {enrolledPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledPrograms.map((program) => {
              const videos = db.getVideosForProgram(program.id);
              const progress = db.getProgress(user!.id, program.id);
              const percent = videos.length > 0 ? Math.round((progress.length / videos.length) * 100) : 0;

              return (
                <div key={program.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all flex flex-col">
                  <div className="aspect-video relative overflow-hidden">
                    <img src={program.thumbnail_url} alt={program.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-4">{program.title}</h3>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">অগ্রগতি</span>
                        <span className="text-blue-400 font-bold font-inter">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 mb-6">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                      </div>

                      <Link 
                        to={`/course/${program.slug}`}
                        className="block text-center bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/10"
                      >
                        {percent === 100 ? "আবার দেখুন" : percent > 0 ? "চালিয়ে যান" : "শুরু করুন"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
            <div className="text-6xl mb-6">📚</div>
            <h2 className="text-2xl font-bold mb-3">আপনি এখনো কোনো কোর্সে ভর্তি হননি!</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">নতুন কিছু শিখতে এবং দক্ষতা বৃদ্ধি করতে আজই আমাদের চমৎকার কোর্সগুলোতে জয়েন করুন।</p>
            <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all">কোর্স ব্রাউজ করুন</Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
