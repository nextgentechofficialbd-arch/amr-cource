
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
      <section className="relative overflow-hidden py-24 px-4">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">নতুন ব্যাচে ভর্তি চলছে</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-[1.1] tracking-tight text-white drop-shadow-sm">
            দক্ষতাই হবে আপনার <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">ভবিষ্যৎ শক্তি</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
            বাংলাদেশের প্রিমিয়াম অনলাইন লার্নিং প্ল্যাটফর্ম। জিরো থেকে ক্যারিয়ার গড়ার পূর্ণাঙ্গ গাইডলাইন নিয়ে আমরা আছি আপনার পাশে।
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#courses" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-full font-bold text-xl shadow-2xl shadow-blue-600/30 transition-all transform hover:scale-105 active:scale-95">
              কোর্সগুলো দেখুন
            </a>
            <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-5 rounded-full font-bold text-xl backdrop-blur-sm transition-all">
              ফ্রি ডেমো ক্লাস
            </button>
          </div>

          {/* Floating Stats Card (Simulated UI) */}
          <div className="hidden lg:flex absolute -bottom-10 left-1/2 -translate-x-1/2 gap-12 bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 px-12 py-8 rounded-3xl shadow-2xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-white font-inter">১০০+</div>
              <div className="text-slate-500 text-sm mt-1">সফল স্টুডেন্ট</div>
            </div>
            <div className="w-px bg-white/10 self-stretch"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white font-inter">৫.০</div>
              <div className="text-slate-500 text-sm mt-1">এভারেজ রেটিং</div>
            </div>
            <div className="w-px bg-white/10 self-stretch"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white font-inter">২৪/৭</div>
              <div className="text-slate-500 text-sm mt-1">সাপোর্ট সুবিধা</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-700">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Team Work" />
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl font-bold leading-tight">আমরা শুধু শেখাই না, <br /> আমরা <span className="text-blue-400">ক্যারিয়ার</span> গড়ি।</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              AmrCourse-এর লক্ষ্য হলো প্রযুক্তিনির্ভর বাংলাদেশে এমন একটি লার্নিং ইকোসিস্টেম তৈরি করা যেখানে যে কেউ নিজের সুবিধামতো সময়ে মানসম্মত শিক্ষা গ্রহণ করতে পারে। আমাদের মেন্টররা ইন্ডাস্ট্রির অভিজ্ঞ প্রফেশনাল, যারা আপনাকে প্রতিটি পদক্ষেপে সাহায্য করবেন।
            </p>
            <ul className="space-y-4">
              {[
                "হাতে কলমে প্রজেক্ট ভিত্তিক শিক্ষা",
                "লাইফ-টাইম কোর্স এক্সেস",
                "ইন্ডাস্ট্রি স্ট্যান্ডার্ড মেন্টরশিপ",
                "ডেডিকেটেড ফেসবুক সাপোর্ট গ্রুপ"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-200">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section id="courses" className="py-24 px-4 md:px-8 max-w-7xl mx-auto bg-white/0">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 text-center md:text-left gap-6">
          <div>
            <h2 className="text-4xl font-bold mb-4">আপনার লার্নিং জার্নি শুরু করুন</h2>
            <p className="text-slate-400 max-w-md">মার্কেট ডিমান্ড অনুযায়ী ডিজাইন করা কোর্সগুলো থেকে আপনার পছন্দেরটি বেছে নিন</p>
          </div>
          <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex backdrop-blur-md">
            <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-sm font-bold shadow-lg">সকল কোর্স</button>
            <button className="px-6 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-bold transition-all">পপুলার</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {programs.map((program) => (
            <Link 
              key={program.id} 
              to={`/programs/${program.slug}`}
              className="group bg-slate-800/40 border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-[16/10] relative overflow-hidden m-3 rounded-[1.5rem]">
                <img 
                  src={program.thumbnail_url} 
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">বেস্ট সেলার</span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <span className="text-xs font-bold font-inter">৫.০</span>
                    <span className="text-[10px]">★★★★★</span>
                  </div>
                </div>
              </div>
              <div className="p-8 pt-4">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors line-clamp-1">{program.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-8 leading-relaxed">
                  {program.short_description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 line-through font-inter mb-1">৳ {program.price + 1000}</span>
                    <span className="text-2xl font-bold text-white font-inter tracking-tight">৳ {program.price}</span>
                  </div>
                  <span className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-2xl text-sm font-bold transition-all transform group-hover:scale-105">
                    বিস্তারিত
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">আজই শুরু হোক আপনার শেখার সফর</h2>
          <p className="text-white/80 text-xl mb-12 max-w-xl mx-auto">আমাদের কোর্সগুলোতে ভর্তি হয়ে নিজেকে গড়ে তুলুন আগামীর জন্য। কোনো প্রশ্ন থাকলে আমাদের মেন্টরদের সাথে কথা বলুন।</p>
          <button className="bg-white text-blue-600 px-12 py-5 rounded-full font-bold text-xl shadow-2xl transition-all hover:scale-105 active:scale-95">কল করুন: ০১৯০০-০০০০০০</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] border-t border-white/5 py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">A</div>
              <span className="text-2xl font-bold tracking-tight">AmrCourse</span>
            </Link>
            <p className="text-slate-400 max-w-sm text-lg leading-relaxed">
              মানসম্মত ডিজিটাল শিক্ষা প্রতিটি বাঙালীর কাছে পৌঁছে দেয়াই আমাদের সার্থকতা। স্বপ্ন দেখুন, শিখুন, এগিয়ে যান।
            </p>
            <div className="flex gap-4">
               {/* Mock Social Icons */}
               <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">f</div>
               <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">t</div>
               <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">y</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-white text-lg">গুরুত্বপূর্ণ লিংক</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">সকল কোর্স</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">অ্যাফিলিয়েট প্রোগ্রাম</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">প্রাইভেসি পলিসি</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">শর্তাবলী</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-white text-lg">অফিস</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex gap-3 items-start">
                <span className="text-blue-400">📍</span>
                বাড়ি নং ১২, রোড ০৫, বনানী, ঢাকা - ১২১৩
              </li>
              <li className="flex gap-3 items-center">
                <span className="text-blue-400">📧</span>
                hello@amrcourse.com
              </li>
              <li className="flex gap-3 items-center text-white font-bold text-xl font-inter">
                <span className="text-blue-400">📞</span>
                01900-000000
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AmrCourse Platform. All rights reserved.</p>
          <p>Made with ❤️ in Bangladesh</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
