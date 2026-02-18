'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, Facebook, Star, Users, BookOpen, CheckCircle } from 'lucide-react';

const programs = [
  { 
    title: "AI কোর্স", 
    slug: "ai-course", 
    price: 2500, 
    description: "কৃত্রিম বুদ্ধিমত্তার জগতে প্রবেশ করুন। জেনারেটিভ এআই এবং প্রম্পট ইঞ্জিনিয়ারিং শিখুন।", 
    image: "https://via.placeholder.com/400x225/2563EB/ffffff?text=AI+Course" 
  },
  { 
    title: "ওয়েব ডেভেলপমেন্ট", 
    slug: "web-dev", 
    price: 3000, 
    description: "প্রফেশনাল ওয়েবসাইট তৈরি করুন। HTML, CSS থেকে React পর্যন্ত হাতে-কলমে শিক্ষা।", 
    image: "https://via.placeholder.com/400x225/16A34A/ffffff?text=Web+Dev" 
  },
  { 
    title: "ভিডিও এডিটিং", 
    slug: "video-editing", 
    price: 2000, 
    description: "Premiere Pro ও After Effects দিয়ে প্রফেশনাল ভিডিও এডিটিং মাস্টারক্লাস।", 
    image: "https://via.placeholder.com/400x225/EA580C/ffffff?text=Video+Editing" 
  },
  { 
    title: "Figma ডিজাইন", 
    slug: "figma-design", 
    price: 1800, 
    description: "আধুনিক UI/UX ডিজাইন শিখুন। ফিগমা টুলস এবং ডিজাইন প্রসেসের পূর্ণাঙ্গ গাইড।", 
    image: "https://via.placeholder.com/400x225/7C3AED/ffffff?text=Figma" 
  },
  { 
    title: "ট্রেডিং", 
    slug: "trading", 
    price: 3500, 
    description: "শেয়ার ও ক্রিপ্টো ট্রেডিং শিখুন। টেকনিক্যাল এনালাইসিস এবং রিস্ক ম্যানেজমেন্ট।", 
    image: "https://via.placeholder.com/400x225/DC2626/ffffff?text=Trading" 
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1 — NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-md border-b border-navyDark/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
            AmrCourse
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="#programs" 
              className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-all text-sm"
            >
              কোর্স দেখুন
            </Link>
          </div>
        </div>
      </nav>

      {/* SECTION 2 — HERO */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-br from-navyDark via-[#1E3A5F] to-primary">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-7xl font-bold mb-6 leading-tight"
          >
            দক্ষতা অর্জন করুন, <br />
            <span className="text-white">জীবন বদলান</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100/80 mb-10 max-w-3xl mx-auto"
          >
            বাংলাদেশের সেরা অনলাইন কোর্স প্ল্যাটফর্ম থেকে AI, Web Development, Video Editing, Figma ও Trading শিখুন বাংলায়।
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="#programs" 
              className="w-full sm:w-auto bg-primary hover:bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/20 transition-all"
            >
              আজই শুরু করুন
            </Link>
            <button className="w-full sm:w-auto border border-white/20 hover:bg-white/10 text-white px-10 py-4 rounded-full font-bold text-lg backdrop-blur-sm transition-all">
              আরও জানুন
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — STATS BAR */}
      <section className="bg-navy py-12 px-4 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <BookOpen className="text-primary" />, value: "৫টি", label: "কোর্স" },
            { icon: <Users className="text-primary" />, value: "১০০০+", label: "শিক্ষার্থী" },
            { icon: <CheckCircle className="text-primary" />, value: "৯৫%", label: "সন্তুষ্টি" },
            { icon: <Star className="text-primary" />, value: "৪.৯", label: "রেটিং" }
          ].map((stat, i) => (
            <div key={i} className="text-center flex flex-col items-center">
              <div className="mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-primary font-inter">{stat.value}</div>
              <div className="text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — PROGRAMS GRID */}
      <section id="programs" className="py-24 px-4 bg-navyDark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">আমাদের কোর্সসমূহ</h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, i) => (
              <motion.div 
                key={program.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden flex flex-col shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    HOT
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-navyDark mb-3 group-hover:text-primary transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-muted text-sm mb-6 flex-1 line-clamp-2">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted">কোর্স ফি</span>
                      <span className="text-2xl font-bold text-navyDark font-inter">৳{program.price.toLocaleString()}</span>
                    </div>
                    <Link 
                      href={`/programs/${program.slug}`}
                      className="bg-navyDark text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-primary transition-colors"
                    >
                      বিস্তারিত
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — CONTACT */}
      <section id="contact" className="py-24 px-4 bg-navy">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">যোগাযোগ করুন</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-navyDark rounded-2xl border border-white/5">
              <Phone className="mx-auto mb-4 text-primary" size={32} />
              <div className="text-sm text-muted mb-1">কল করুন</div>
              <div className="font-bold text-lg font-inter">01XXXXXXXXX</div>
            </div>
            <div className="p-6 bg-navyDark rounded-2xl border border-white/5">
              <Mail className="mx-auto mb-4 text-primary" size={32} />
              <div className="text-sm text-muted mb-1">ইমেইল করুন</div>
              <div className="font-bold text-lg">info@amrcourse.com</div>
            </div>
            <div className="p-6 bg-navyDark rounded-2xl border border-white/5">
              <Facebook className="mx-auto mb-4 text-primary" size={32} />
              <div className="text-sm text-muted mb-1">ফেসবুক পেজ</div>
              <div className="font-bold text-lg">AmrCourse</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — FOOTER */}
      <footer className="py-12 px-4 bg-navyDark border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-center gap-2">
             <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold">A</div>
             <span className="text-xl font-bold text-white">AmrCourse</span>
          </div>
          <p className="text-muted text-sm mb-4">
            মানসম্মত ডিজিটাল শিক্ষা প্রতিটি বাঙালীর কাছে পৌঁছে দেয়াই আমাদের সার্থকতা। স্বপ্ন দেখুন, শিখুন, এগিয়ে যান।
          </p>
          <div className="text-muted text-xs">
            © ২০২৬ AmrCourse | সর্বস্বত্ব সংরক্ষিত
          </div>
        </div>
      </footer>
    </div>
  );
}