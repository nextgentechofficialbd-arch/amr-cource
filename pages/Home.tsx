
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { db } from '../services/dbService';

const Home: React.FC = () => {
  const programs = db.getPrograms();

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
            আপনার দক্ষতাকে নিয়ে যান <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">পরবর্তী ধাপে</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            বাংলাদেশের সবচেয়ে সহজ এবং কার্যকরী অনলাইন লার্নিং প্ল্যাটফর্ম। ঘরে বসেই শিখুন প্রফেশনাল স্কিল আর হয়ে উঠুন স্বাবলম্বী।
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#courses" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-600/20 transition-all transform hover:scale-105">
              কোর্স দেখুন
            </a>
            <button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all">
              ফ্রি সেমিনার
            </button>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section id="courses" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">আমাদের কোর্সসমূহ</h2>
            <p className="text-slate-400">আপনার পছন্দের বিষয় বেছে নিন এবং শেখা শুরু করুন</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-slate-800/50 p-1 rounded-lg border border-slate-700 flex">
              <button className="px-4 py-2 rounded-md bg-blue-600 text-sm font-semibold">সকল কোর্স</button>
              <button className="px-4 py-2 rounded-md text-slate-400 hover:text-white text-sm font-semibold">পপুলার</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Link 
              key={program.id} 
              to={`/programs/${program.slug}`}
              className="group bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/5"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={program.thumbnail_url} 
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  বেস্ট সেলার
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{program.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">
                  {program.short_description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 line-through font-inter">৳ {program.price + 1000}</span>
                    <span className="text-xl font-bold text-blue-400 font-inter">৳ {program.price}</span>
                  </div>
                  <span className="bg-blue-600/10 text-blue-400 px-4 py-2 rounded-lg text-sm font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                    বিস্তারিত দেখুন
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-lg">A</div>
              <span className="text-xl font-bold tracking-tight">AmrCourse</span>
            </Link>
            <p className="text-slate-400 max-w-sm">
              আমরা বিশ্বাস করি সঠিক দিকনির্দেশনা এবং মানসম্মত শিক্ষা একজন মানুষের জীবন বদলে দিতে পারে। আমাদের লক্ষ্য বাংলাদেশের প্রতিটি প্রান্তে ফ্রিল্যান্সিং এবং আইটি দক্ষতা পৌঁছে দেয়া।
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white">লিংকস</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">হোম</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">গোপনীয়তা নীতি</a></li>
              <li><a href="#" className="hover:text-white transition-colors">শর্তাবলী</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white">যোগাযোগ</h4>
            <ul className="space-y-4 text-slate-400">
              <li>০১৯০০-০০০০০০</li>
              <li>support@amrcourse.com</li>
              <li>ঢাকা, বাংলাদেশ</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} AmrCourse. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
