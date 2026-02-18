
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { db } from '../services/dbService';
import { getFaqAnswer } from '../services/geminiService';
import { Program, Video } from '../types';

const ProgramDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [faqInput, setFaqInput] = useState('');
  const [faqAnswer, setFaqAnswer] = useState<{ q: string, a: string }[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  // Enrollment Form State
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
        navigate('/');
      }
    }
  }, [slug, navigate]);

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
      navigate('/');
    }
  };

  if (!program) return null;

  const finalPrice = Math.floor(program.price * (1 - discount / 100));

  return (
    <div className="bg-[#0F172A] min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Content */}
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">{program.title}</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              {program.description}
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-6">কোর্স কারিকুলাম</h2>
            <div className="space-y-4">
              {videos.length > 0 ? videos.map((v, i) => (
                <div key={v.id} className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-inter font-bold">
                    {i + 1}
                  </div>
                  <span className="font-medium">{v.title}</span>
                </div>
              )) : (
                <p className="text-slate-500 italic">এখনও কোনো ভিডিও আপলোড করা হয়নি।</p>
              )}
            </div>
          </div>

          {/* AI FAQ Section */}
          <div className="bg-blue-600/5 rounded-2xl p-8 border border-blue-500/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> কোর্সটি নিয়ে কিছু জানতে চান?
            </h2>
            <p className="text-slate-400 mb-6">আমাদের AI অ্যাসিস্ট্যান্টকে আপনার প্রশ্নটি করুন।</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={faqInput}
                onChange={(e) => setFaqInput(e.target.value)}
                placeholder="যেমন: এই কোর্সটি শিখলে কি ফ্রিল্যান্সিং করা যাবে?"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button 
                onClick={handleAskAi}
                disabled={isAsking}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 px-6 rounded-lg font-bold transition-all"
              >
                {isAsking ? 'ভাবছি...' : 'জিজ্ঞেস করুন'}
              </button>
            </div>

            <div className="mt-8 space-y-4">
              {faqAnswer.map((item, idx) => (
                <div key={idx} className="bg-slate-800/40 p-5 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
                  <p className="font-bold text-blue-400 mb-2 font-inter">Q: {item.q}</p>
                  <p className="text-slate-300 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sticky Sidebar Enrollment */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <span className="text-slate-500 line-through text-sm font-inter">৳ {program.price + 1000}</span>
                    <span className="text-4xl font-bold text-white font-inter">৳ {finalPrice}</span>
                  </div>
                  <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {Math.round(((program.price + 1000 - finalPrice) / (program.price + 1000)) * 100)}% OFF
                  </span>
                </div>

                <form onSubmit={handleEnroll} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">আপনার নাম</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">ইমেইল এড্রেস</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">ফোন নম্বর</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="pt-4 space-y-4">
                    <div className="bg-blue-600/10 p-4 rounded-xl border border-blue-500/20">
                      <p className="text-sm font-bold text-blue-400 mb-2">পেমেন্ট মেথড: bKash (Personal)</p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        নিচের নম্বরে ৳{finalPrice} পাঠিয়ে ট্রানজেকশন আইডি দিন। <br />
                        নম্বর: <span className="text-white font-bold select-all">01900-000000</span>
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">bKash TrxID</label>
                      <input 
                        required
                        type="text" 
                        value={formData.trxId}
                        onChange={(e) => setFormData({ ...formData, trxId: e.target.value })}
                        placeholder="যেমন: 8N7S6D5A"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 font-inter tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]">
                    ভর্তি নিশ্চিত করুন
                  </button>
                </form>

                <div className="mt-6 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="প্রোমো কোড" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                  <button 
                    onClick={handleApplyPromo}
                    className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
            <p className="text-center text-slate-500 text-sm">
              যেকোনো সমস্যায় কল করুন: 01900-000000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
