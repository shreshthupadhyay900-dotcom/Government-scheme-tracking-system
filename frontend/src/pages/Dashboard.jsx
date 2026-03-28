import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { Clipboard, Clock, CheckCircle, XCircle, FileText, Sparkles, Zap, ChevronRight, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const chartData = [
  { name: 'Jan', applied: 4 },
  { name: 'Feb', applied: 10 },
  { name: 'Mar', applied: 15 },
  { name: 'Apr', applied: 8 },
  { name: 'May', applied: 12 },
  { name: 'Jun', applied: 20 },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, recRes] = await Promise.all([
          api.get('/applications'),
          api.post('/recommendations', {
            age: user.age || 25,
            income: user.income || 300000,
            state: user.state || 'All',
            occupation: user.occupation || 'Any',
            category: user.category || 'All',
            uploadedDocuments: []
          })
        ]);
        setApplications(appRes.data);
        if (recRes.data.topRecommendations?.length > 0) {
          setRecommendation(recRes.data.topRecommendations[0]);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle className="text-green-500 w-5 h-5" />;
      case 'rejected': return <XCircle className="text-red-500 w-5 h-5" />;
      case 'under review': return <Clock className="text-accent w-5 h-5" />;
      default: return <FileText className="text-slate-400 w-5 h-5" />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under review': return 'bg-amber-100 text-amber-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading your personalized dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-10"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Intelligence Dashboard</h1>
            <p className="text-slate-400 mt-2 text-lg font-medium">Monitoring your governance profile and application matrix.</p>
          </div>
          <Link to="/recommendations" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center group whitespace-nowrap">
            View AI Recommendations
            <Sparkles className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Applications Logged', value: applications.length, icon: <Clipboard className="w-8 h-8" />, color: 'primary' },
            { label: 'Under Verification', value: applications.filter(a => a.status === 'under review' || a.status === 'submitted').length, icon: <Clock className="w-8 h-8" />, color: 'secondary' },
            { label: 'Successful Grants', value: applications.filter(a => a.status === 'approved').length, icon: <CheckCircle className="w-8 h-8" />, color: 'accent' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx }}
              className="glassmorphism p-8 rounded-3xl border-white/10 flex items-center space-x-6 hover:purple-glow transition-all group"
            >
              <div className={`bg-${stat.color}/20 p-5 rounded-2xl text-${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black text-white mt-1">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Top Recommendation Widget */}
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism p-8 rounded-[2.5rem] border-primary/20 bg-primary/5 relative overflow-hidden group hover:purple-glow transition-all"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-32 h-32 text-primary" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary text-white p-2 rounded-xl">
                  <Zap className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-black text-white tracking-widest uppercase text-xs text-primary">Highest Match Probability</h2>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-white mb-2">{recommendation.schemeName}</h3>
                  <p className="text-slate-400 font-medium max-w-2xl line-clamp-2">{recommendation.reason}</p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                       <Award className="w-4 h-4 text-emerald-400" />
                       <span className="text-sm font-black text-white">{recommendation.score}/100 Match</span>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                       <Clock className="w-4 h-4 text-primary" />
                       <span className="text-sm font-black text-white">{recommendation.avgProcessingTime}</span>
                    </div>
                  </div>
                </div>
                <Link to="/recommendations" className="bg-white text-[#020617] px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-2xl">
                  Review & Apply <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mid Section: Analytics & Vault */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glassmorphism p-8 rounded-[2.5rem] border-white/10"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight">Engagement Matrix</h2>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-primary/20">H1 2026 Analysis</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px -12px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="applied" stroke="#8b5cf6" strokeWidth={5} fillOpacity={1} fill="url(#colorPrimary)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Document Vault Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glassmorphism p-8 rounded-[2.5rem] border-white/10 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight">Secure Vault</h2>
              <FileText className="text-primary w-6 h-6" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
               <div className="p-6 bg-slate-900/50 rounded-full border border-white/5 purple-glow">
                  <FileText className="w-12 h-12 text-slate-500" />
               </div>
               <p className="text-slate-400 font-medium">Streamline applications by managing your documents in one secure place.</p>
               <Link to="/vault" className="text-primary font-bold hover:text-white transition-all underline underline-offset-8 decoration-primary/30">Access Full Vault</Link>
            </div>
          </motion.div>
        </div>

        {/* Applications Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism rounded-[2.5rem] border-white/10 overflow-hidden"
        >
          <div className="px-10 py-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <h2 className="text-2xl font-black text-white tracking-tight">Active Applications</h2>
            <span className="text-slate-500 text-sm font-bold">Latest Updates</span>
          </div>
          
          {applications.length === 0 ? (
            <div className="p-16 text-center">
              <div className="mb-4 inline-block p-4 bg-slate-900 rounded-2xl border border-white/5">
                <XCircle className="w-8 h-8 text-slate-700" />
              </div>
              <p className="text-slate-500 text-lg font-medium">No active application sequences found in your matrix.</p>
              <Link to="/schemes" className="text-primary font-bold mt-4 inline-block hover:underline underline-offset-4">Initialize Discovery Sequence</Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {applications.map((app, i) => (
                <motion.div 
                  key={app._id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-10 py-8 hover:bg-white/5 transition-all flex flex-col md:flex-row justify-between md:items-center gap-8 group"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-xl group-hover:text-primary transition-colors">{app.schemeId?.name || 'Incomplete Entry'}</h3>
                    <p className="text-slate-400 mt-2 line-clamp-2 max-w-2xl font-medium">{app.schemeId?.description || 'Data synchronization in progress...'}</p>
                    <div className="flex items-center space-x-4 mt-4">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-lg border border-white/5">ID: {app._id.slice(-6)}</span>
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logged: {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-white/5 ${getStatusClass(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {app.status}
                    </span>
                    <button className="bg-slate-900 text-white font-bold text-sm px-6 py-3 rounded-xl border border-white/10 hover:border-primary/50 transition-all hover:purple-glow whitespace-nowrap">Manage Case</button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
