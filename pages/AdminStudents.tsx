
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/dbService';
import { Student } from '../types';

const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(db.getAllStudents());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm)
  );

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
            <Link to="/admin/students" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-lg font-bold">
              <span>👥</span> স্টুডেন্ট লিস্ট
            </Link>
            <Link to="/admin/promocodes" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-all">
              <span>🎟️</span> প্রোমো কোড
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">স্টুডেন্ট ম্যানেজমেন্ট</h1>
            <p className="text-slate-400">সকল নিবন্ধিত স্টুডেন্টদের তালিকা ও তথ্য</p>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-12 py-3 w-80 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">নাম ও ইমেইল</th>
                  <th className="px-6 py-4">ফোন নম্বর</th>
                  <th className="px-6 py-4 text-center">এনরোল করা কোর্স</th>
                  <th className="px-6 py-4">জয়েনিং ডেট</th>
                  <th className="px-6 py-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                  <tr key={student.id} className="text-sm hover:bg-slate-900/30 transition-all">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400">
                          {student.full_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white">{student.full_name}</p>
                          <p className="text-xs text-slate-500 font-inter">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-inter text-slate-300">
                      {student.phone}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold font-inter border border-blue-500/20">
                        {db.getStudentEnrollmentCount(student.id)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-500 text-xs">
                      {new Date(student.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-blue-400 hover:text-white font-bold text-xs">বিস্তারিত</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-slate-500">
                      কোনো স্টুডেন্ট পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminStudents;
