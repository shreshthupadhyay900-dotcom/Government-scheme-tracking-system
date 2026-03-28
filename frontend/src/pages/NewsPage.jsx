import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, ExternalLink, Tag, Clock, TrendingUp, Search, Filter } from 'lucide-react';

const news = [
  {
    id: 1,
    category: 'Central',
    tag: 'Agriculture',
    title: 'PM-KISAN 18th Installment Released for 9.4 Crore Farmers',
    summary: 'The Prime Minister transferred ₹20,000 crore directly to the bank accounts of farmers as the 18th installment of PM-KISAN benefiting over 9.4 crore beneficiaries.',
    date: '2026-03-20',
    source: 'PIB India',
    href: 'https://pib.gov.in',
    hot: true,
  },
  {
    id: 2,
    category: 'Education',
    tag: 'Scholarship',
    title: 'National Scholarship Portal: New Application Window Open for 2026-27',
    summary: 'Students from Pre-Matric to Post-Matric levels can apply for 50+ central government scholarships. OBC, SC, ST, and Minority scholarships included.',
    date: '2026-03-18',
    source: 'NSP Portal',
    href: 'https://scholarships.gov.in',
    hot: true,
  },
  {
    id: 3,
    category: 'State',
    tag: 'West Bengal',
    title: 'Kanyashree Prakalpa Scholarship Window Reopened',
    summary: 'West Bengal government has reopened applications for Kanyashree Prakalpa, offering ₹1,000 to ₹25,000 scholarships for girls aged 13-18 to continue education.',
    date: '2026-03-15',
    source: 'WB Education Dept.',
    href: 'https://wbkanyashree.gov.in',
    hot: false,
  },
  {
    id: 4,
    category: 'Housing',
    tag: 'Central',
    title: 'PM Awas Yojana (Urban) Phase 2.0 Launched with ₹2.30 Lakh Crore Budget',
    summary: 'New phase of PMAY-Urban targets construction of 1 crore additional houses for urban poor and middle-income groups with enhanced interest subsidies.',
    date: '2026-03-12',
    source: 'Ministry of Housing',
    href: 'https://pmaymis.gov.in',
    hot: false,
  },
  {
    id: 5,
    category: 'International',
    tag: 'Scholarship',
    title: 'ICCR Cultural Exchange Scholarships 2026 - 4600 Seats Available',
    summary: 'Indian Council for Cultural Relations offers 4600 scholarships for international students across 27 countries. Applications now open for August 2026 intake.',
    date: '2026-03-10',
    source: 'ICCR',
    href: 'https://a2ascholarships.iccr.gov.in',
    hot: false,
  },
  {
    id: 6,
    category: 'Health',
    tag: 'Central',
    title: 'Ayushman Bharat Coverage Extended to All Citizens Above 70 Years',
    summary: 'Government expands Ayushman Bharat-PMJAY to cover all Indian citizens aged 70 and above irrespective of income, providing ₹5 lakh health cover.',
    date: '2026-03-07',
    source: 'NHA India',
    href: 'https://pmjay.gov.in',
    hot: true,
  },
  {
    id: 7,
    category: 'Startup',
    tag: 'MSME',
    title: 'Startup India Seed Fund Scheme 2.0: ₹1,000 Crore for Early-Stage Startups',
    summary: 'DPIIT announces a new ₹1,000 crore seed fund for early-stage startups with grants of up to ₹20 lakh for proof-of-concept and ₹50 lakh for commercialization.',
    date: '2026-03-04',
    source: 'Startup India',
    href: 'https://startupindia.gov.in',
    hot: false,
  },
  {
    id: 8,
    category: 'State',
    tag: 'Telangana',
    title: 'Rythu Bandhu 2026 - Investment Support of ₹10,000 per Acre per Season',
    summary: 'Telangana government releases Rythu Bandhu farm investment support for Rabi 2026, benefiting over 69 lakh farmer families with direct cash transfers.',
    date: '2026-02-28',
    source: 'Telangana Govt.',
    href: 'https://rythubandhu.telangana.gov.in',
    hot: false,
  },
];

const CATEGORIES = ['All', 'Central', 'State', 'Education', 'Health', 'Housing', 'Startup', 'International'];

const tagColors = {
  Agriculture: 'bg-green-500/20 text-green-400 border-green-500/20',
  Scholarship: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  'West Bengal': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
  Central: 'bg-primary/20 text-primary border-primary/20',
  MSME: 'bg-orange-500/20 text-orange-400 border-orange-500/20',
  Telangana: 'bg-pink-500/20 text-pink-400 border-pink-500/20',
};

const NewsPage = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = news.filter(n =>
    (filter === 'All' || n.category === filter || n.tag === filter) &&
    (n.title.toLowerCase().includes(search.toLowerCase()) || n.summary.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-xs mb-4">
              <div className="w-12 h-[1px] bg-primary" />
              Live Intelligence Feed
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
              Policy <span className="text-primary italic">Pulse.</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium mt-4 max-w-xl">
              Track real-time government scheme updates, policy changes, and announcements sourced directly from official portals.
            </p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 font-black text-sm uppercase tracking-widest">Live</span>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search news, schemes, policies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 font-bold outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-white/10 flex-wrap">
            <Filter className="w-4 h-4 text-slate-600 mx-2" />
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${filter === c ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ x: 4 }}
                  className="block glassmorphism rounded-3xl border-white/10 p-8 hover:border-primary/30 hover:purple-glow transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${tagColors[item.tag] || 'bg-primary/20 text-primary border-primary/20'}`}>
                        {item.tag}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                        {item.category}
                      </span>
                      {item.hot && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Hot
                        </span>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-700 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors leading-tight mb-3">{item.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed text-sm line-clamp-2">{item.summary}</p>
                  <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{new Date(item.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{item.source}</span>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="text-center py-20 text-slate-600 font-bold">No news found for your search.</div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glassmorphism rounded-3xl border-white/10 p-6 purple-glow">
              <h3 className="text-white font-black text-lg mb-5 uppercase tracking-widest text-xs text-primary">🔥 Trending Today</h3>
              <div className="space-y-4">
                {news.filter(n => n.hot).map((item, i) => (
                  <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" className="flex gap-4 group cursor-pointer">
                    <span className="text-3xl font-black text-white/10 group-hover:text-primary/30 transition-colors leading-none">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors line-clamp-2">{item.title}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="glassmorphism rounded-3xl border-white/10 p-6">
              <h3 className="text-white font-black text-sm uppercase tracking-widest mb-5">📌 Official Portals</h3>
              <div className="space-y-3">
                {[
                  { name: 'India.gov.in', url: 'https://india.gov.in' },
                  { name: 'MyScheme.gov.in', url: 'https://myscheme.gov.in' },
                  { name: 'NSP Scholarships', url: 'https://scholarships.gov.in' },
                  { name: 'UMANG App Portal', url: 'https://web.umang.gov.in' },
                  { name: 'PM-KISAN Portal', url: 'https://pmkisan.gov.in' },
                  { name: 'Startup India', url: 'https://startupindia.gov.in' },
                ].map(p => (
                  <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-primary/10 hover:border-primary/20 border border-white/5 transition-all group">
                    <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{p.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsPage;
