import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Smartphone, ShieldCheck, Zap,
  Newspaper, Calculator, Users, Award, TrendingUp, Star,
  FileText, Brain, Globe
} from 'lucide-react';

const STATS = [
  { value: '9,400+', label: 'Crore Farmers Benefited', icon: <Award className="w-6 h-6" /> },
  { value: '₹2.3L Cr', label: 'Scheme Budget Range', icon: <TrendingUp className="w-6 h-6" /> },
  { value: '50+', label: 'Central & State Schemes', icon: <FileText className="w-6 h-6" /> },
  { value: '99.8%', label: 'Data Accuracy Rate', icon: <CheckCircle className="w-6 h-6" /> },
];

const TESTIMONIALS = [
  { name: 'Ramesh K.', role: 'Farmer, Maharashtra', text: 'Found PM-KISAN and Soil Health Card in minutes. Got ₹6000 in my account within a week!', avatar: 'R' },
  { name: 'Priya S.', role: 'Student, Tamil Nadu', text: 'NSP Scholarship matched my profile perfectly. The AI tool saved hours of searching.', avatar: 'P' },
  { name: 'Anita M.', role: 'Entrepreneur, Delhi', text: 'Startup India seed fund was exactly what I needed. Document Vault made my application smooth.', avatar: 'A' },
];

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#020617] overflow-hidden font-sans transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative pt-24 pb-24 lg:pt-40 lg:pb-40 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[140px] animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="mb-8 inline-flex items-center space-x-3 px-6 py-2.5 bg-primary/10 dark:bg-primary/5 border border-primary/20 rounded-full text-primary font-bold text-xs uppercase tracking-[0.2em]"
          >
            <Zap className="w-4 h-4 fill-primary" />
            <span>AI-Powered Governance Platform</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl lg:text-8xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight"
          >
            Unified Governance <br />
            <span className="text-gradient">Simplified for You.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg lg:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mb-12 leading-relaxed font-medium"
          >
            Discover, apply, and track government schemes across Central, State, and International levels with our advanced AI-driven hub.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center"
          >
            <Link to="/register" className="px-12 py-5 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark hover:purple-glow shadow-2xl shadow-primary/30 transition-all flex items-center justify-center group">
              {t('get_started')}
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/calculator" className="px-12 py-5 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl font-bold text-lg hover:bg-secondary/20 transition-all flex items-center justify-center">
              <Calculator className="mr-2 w-5 h-5" /> Check Eligibility
            </Link>
            <Link to="/schemes" className="px-12 py-5 glassmorphism dark:bg-white/5 dark:text-white text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center">
              Explore Schemes
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Live Stats Banner */}
      <section className="py-16 border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6 glassmorphism rounded-3xl border-white/10 hover:purple-glow transition-all"
            >
              <div className="bg-primary/10 text-primary p-3 rounded-2xl mb-4">{s.icon}</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Next-Gen Digital Infrastructure</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: 'AI Matching Engine', desc: 'Our neural engine analyzes your profile to find perfect scheme matches instantly.', icon: <Brain className="w-7 h-7" />, link: '/calculator' },
              { title: 'Smart Live Tracking', desc: 'End-to-end transparent monitoring of your applications with real-time push alerts.', icon: <Smartphone className="w-7 h-7" />, link: '/dashboard' },
              { title: 'Policy Pulse Feed', desc: 'Real-time news and updates on government welfare notifications and policy changes.', icon: <Newspaper className="w-7 h-7" />, link: '/news' },
              { title: 'AI Document Vault', desc: 'Upload your PDFs and get AI-powered verification and scheme eligibility analysis.', icon: <FileText className="w-7 h-7" />, link: '/vault' },
              { title: 'Global Scheme Access', desc: 'Access Central, State and International scholarships and schemes from one platform.', icon: <Globe className="w-7 h-7" />, link: '/schemes' },
              { title: 'Military-Grade Security', desc: 'Your personal data and documents are protected with high-level AES-256 encryption.', icon: <ShieldCheck className="w-7 h-7" />, link: '/register' },
            ].map((feature, idx) => (
              <Link key={idx} to={feature.link}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="glassmorphism p-10 rounded-[2.5rem] hover:purple-glow transition-all duration-500 group border-white/10 dark:border-white/5 h-full"
                >
                  <div className="bg-primary/10 dark:bg-primary/20 p-5 rounded-2xl w-fit text-primary mb-8 transition-all group-hover:bg-primary group-hover:text-white group-hover:rotate-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-slate-50/50 dark:bg-white/[0.02] border-y border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Citizen Success Stories</h2>
            <p className="text-slate-400 font-medium text-lg">Real people, real benefits, powered by SmartGov AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glassmorphism p-8 rounded-3xl border-white/10 hover:purple-glow transition-all"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, s) => <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-400 dark:text-slate-300 font-medium leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl">{t.avatar}</div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-sm text-slate-400 font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glassmorphism rounded-[3rem] p-16 border-white/10 purple-glow relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-5 py-2 rounded-full text-primary font-black text-xs uppercase tracking-widest mb-8">
                <Users className="w-4 h-4" /> Join 1M+ Citizens
              </div>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
                Your Benefits Are Waiting.
              </h2>
              <p className="text-slate-400 text-xl font-medium mb-10 max-w-2xl mx-auto">
                Stop missing out on government schemes you're entitled to. SmartGov AI matches your profile to hundreds of welfare programs in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="px-12 py-5 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-2">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/news" className="px-12 py-5 glassmorphism dark:bg-white/5 dark:text-white text-slate-700 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <Newspaper className="w-5 h-5" /> Latest News
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
