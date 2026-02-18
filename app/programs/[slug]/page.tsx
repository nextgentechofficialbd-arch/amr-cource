
'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { db } from '../../../services/dbService';
import { getFaqAnswer } from '../../../services/geminiService';
import { Program, Video } from '../../../types';

export default function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  
  const [program, setProgram] = useState<Program | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [faqInput, setFaqInput] = useState('');
  const [faqAnswer, setFaqAnswer] = useState<{ q: string, a: string }[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    trxId: ''
  });

  useEffect(() => {
    if (slug) {
      const p = db.getProgramBySlug(slug);
      if (p) {
        setProgram(p);
        setVideos(db.getVideosForProgram(p.id));
      } else {
        router.push('/');
      }
    }
  }, [slug, router]);

  const handleApplyPromo = () => {
    if (!promoCode) {
      setDiscount(0);
      setAppliedPromo('');
      return;
    }
    const result = db.validatePromo(promoCode);
    if (result) {
      setDiscount(result.discount_percent);
      setAppliedPromo(result.code);
      alert(`${result.discount_percent}% ডিসকাউন্ট সফলভাবে প্রয়োগ করা হয়েছে!`);
    } else {
      setDiscount(0);
      setAppliedPromo('');
      alert('দুঃখিত, এই প্রোমো কোডটি সঠিক নয় বা এর মেয়াদ শেষ হয়ে গেছে।');
    }
  };

  const handleAskAi = async () => {
    if (!faqInput || !program) return;
    setIsAsking(true);
    const answer = await getFaqAnswer(program.title, faqInput);
    setFaqAnswer([{ q: faqInput, a: answer }, ...faqAnswer]);
    setFaqInput('');
    setIsAsking(false);
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!program) return;
    
    const finalAmount = Math.floor(program.price * (1 - discount / 100));
    const success = db.submitEnrollment({
      ...formData,
      programId: program.id,
      amount: finalAmount,
      promoCode: appliedPromo || undefined
    });

    if (success) {
      alert('আপনার পেমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে। ২৪ ঘন্টার মধ্যে ভেরিফাই করা হবে।');
      router.push('/');
    }
  };

  if (!program) return null;

  const finalPrice = Math.floor(program.price * (1 - discount / 100));

  return (
    <div className="bg-[#0F172A] min-h-screen text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">{program.title}</h1>
            <p className="text-slate-400 text-lg leading-relaxed">{program.description}</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-6">কোর্স কারিকুলাম</h2>
            <div className="space-y-4">
              {videos.length > 0 ? videos.map((v, i) => (
                <div key={v.id} className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">{i + 1}</div>
                  <span className="font-medium">{v.title}</span>
                </div>
              )) : <p className="text-slate-500 italic">এখনও কোনো ভিডিও আপলোড করা হয়নি।</p>}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-bold">৳ {finalPrice}</span>
                </div>
                <form onSubmit={handleEnroll} className="space-y-4">
                  <input required placeholder="আপনার নাম" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />
                  <input required type="email" placeholder="ইমেইল" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />
                  <input required placeholder="ফোন" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />
                  <input required placeholder="bKash TrxID" value={formData.trxId} onChange={(e) => setFormData({ ...formData, trxId: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />
                  <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold">ভর্তি নিশ্চিত করুন</button>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
