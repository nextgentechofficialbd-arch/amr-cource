
'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { db } from '../../services/dbService';

export default function DashboardPage() {
  const user = db.getCurrentUser();
  const enrolledPrograms = user ? db.getEnrolledPrograms(user.id) : [];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
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
                <div key={program.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-4">{program.title}</h3>
                    <div className="mt-auto">
                      <div className="w-full bg-slate-900 rounded-full h-2 mb-6">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                      </div>
                      <Link 
                        href={`/course/${program.slug}`}
                        className="block text-center bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold"
                      >
                        প্রবেশ করুন
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
            <h2 className="text-2xl font-bold mb-3 text-white">আপনি এখনো কোনো কোর্সে ভর্তি হননি!</h2>
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold">কোর্স ব্রাউজ করুন</Link>
          </div>
        )}
      </main>
    </div>
  );
}
