import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, RefreshCw, CheckCircle, AlertCircle, XCircle,
    TrendingUp, FileText, Clock, Zap, ChevronDown, ChevronUp,
    Target, Award, Search
} from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
    eligible: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle className="w-4 h-4" />, label: 'Eligible' },
    'partially eligible': { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: <AlertCircle className="w-4 h-4" />, label: 'Partially Eligible' },
    'not eligible': { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: <XCircle className="w-4 h-4" />, label: 'Not Eligible' },
};

const RISK_CONFIG = {
    low: { color: 'text-emerald-400', label: 'Low Risk' },
    medium: { color: 'text-yellow-400', label: 'Medium Risk' },
    high: { color: 'text-red-400', label: 'High Risk' },
};

const ScoreBar = ({ score, animated = true }) => {
    const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
    return (
        <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
            <motion.div
                initial={{ width: animated ? 0 : `${score}%` }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
            />
        </div>
    );
};

const SchemeCard = ({ scheme, rank }) => {
    const [expanded, setExpanded] = useState(false);
    const status = STATUS_CONFIG[scheme.eligibilityStatus];
    const risk = RISK_CONFIG[scheme.riskLevel];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.07 }}
            className={`glassmorphism rounded-3xl border-white/10 overflow-hidden transition-all ${rank === 0 ? 'purple-glow border-primary/30' : ''}`}
        >
            <div className="p-7">
                {/* Top Row */}
                <div className="flex justify-between items-start gap-4 mb-5">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            {rank === 0 && (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    <Award className="w-3 h-3" /> Top Pick
                                </span>
                            )}
                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.bg} ${status.color}`}>
                                {status.icon} {status.label}
                            </span>
                            <span className="px-3 py-1 bg-white/5 text-slate-500 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest">{scheme.category}</span>
                        </div>
                        <h3 className="text-lg font-black text-white leading-tight">{scheme.schemeName}</h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-3xl font-black text-white">{scheme.score}</div>
                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">/ 100</div>
                    </div>
                </div>

                {/* Score Bar */}
                <div className="mb-5">
                    <ScoreBar score={scheme.score} />
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                    <div className="bg-white/5 rounded-2xl p-3 text-center">
                        <div className="text-xs font-black text-slate-600 uppercase tracking-widest mb-1">Success</div>
                        <div className="text-lg font-black text-primary">{scheme.successProbability}%</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 text-center">
                        <div className="text-xs font-black text-slate-600 uppercase tracking-widest mb-1">Risk</div>
                        <div className={`text-sm font-black ${risk.color}`}>{risk.label}</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 text-center">
                        <div className="text-xs font-black text-slate-600 uppercase tracking-widest mb-1">Time</div>
                        <div className="text-xs font-black text-white">{scheme.avgProcessingTime || '30 days'}</div>
                    </div>
                </div>

                {/* Reason */}
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-4">{scheme.reason}</p>

                {/* Missing Docs Warning */}
                {scheme.missingDocs?.length > 0 && (
                    <div className="flex items-start gap-2 bg-yellow-500/5 border border-yellow-500/15 rounded-2xl p-3 mb-4">
                        <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-400 font-bold">Missing: {scheme.missingDocs.join(', ')}</p>
                    </div>
                )}

                {/* Expand Toggle */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-between text-xs font-black text-slate-600 hover:text-primary transition-colors pt-3 border-t border-white/5"
                >
                    <span>{expanded ? 'Hide Details' : 'Why this scheme?'}</span>
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 space-y-3">
                                <div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Benefits</p>
                                    <p className="text-sm text-slate-300 font-medium">{scheme.benefits}</p>
                                </div>
                                {scheme.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {scheme.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-primary/10 text-primary/70 rounded-lg text-[10px] font-black uppercase tracking-wider">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <Link
                                    to="/schemes"
                                    className="inline-flex items-center gap-2 text-xs font-black text-primary hover:text-white transition-colors"
                                >
                                    <FileText className="w-3.5 h-3.5" /> View Full Scheme Details
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const RecommendationPage = () => {
    const { user } = useContext(AuthContext);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchRecommendations = async () => {
        if (!user) return toast.error('Please sign in to get recommendations');
        setLoading(true);
        try {
            const profile = {
                age: user.age || 25,
                income: user.income || 300000,
                state: user.state || 'All',
                occupation: user.occupation || 'Any',
                gender: user.gender || 'any',
                category: user.category || 'All',
                uploadedDocuments: [],
            };
            const res = await api.post('/recommendations', profile);
            setResults(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch recommendations');
        } finally {
            setLoading(false);
        }
    };

    const handleSemanticSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearchLoading(true);
        try {
            const res = await api.post('/search/semantic', { query: searchQuery });
            setSearchResults(res.data);
        } catch (err) {
            toast.error('Search failed');
        } finally {
            setSearchLoading(false);
        }
    };

    const displaySchemes = results?.topRecommendations?.filter(s =>
        filterStatus === 'all' || s.eligibilityStatus === filterStatus
    ) || [];

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-5 py-2 rounded-full text-primary font-black text-xs uppercase tracking-[0.3em] mb-6">
                        <Sparkles className="w-4 h-4" /> AI Recommendation Engine
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4">
                        Your <span className="text-primary italic">Personalized</span> Schemes
                    </h1>
                    <p className="text-slate-400 font-medium text-lg">
                        Our AI analyzes your profile across 8 dimensions — age, income, state, occupation, category, documents, and more — to rank the best matching schemes.
                    </p>
                </div>

                {/* Semantic Search */}
                <div className="glassmorphism rounded-3xl border-white/10 p-8">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Search className="w-4 h-4" /> AI-Powered Semantic Search
                    </h3>
                    <form onSubmit={handleSemanticSearch} className="flex gap-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder='Try: "I am a student from MP looking for scholarship" or "farmer loan scheme Gujarat"'
                            className="flex-1 bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 font-bold outline-none focus:border-primary/50 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={searchLoading}
                            className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black transition-all shadow-lg shadow-primary/20 disabled:opacity-60 flex items-center gap-2 flex-shrink-0"
                        >
                            {searchLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            {searchLoading ? 'Searching...' : 'Search'}
                        </button>
                    </form>

                    {/* Search Results */}
                    <AnimatePresence>
                        {searchResults && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <p className="text-sm text-slate-400 font-bold">{searchResults.summary}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {searchResults.schemes?.slice(0, 6).map((scheme, i) => (
                                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-all">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <h4 className="font-black text-white text-sm">{scheme.name}</h4>
                                                <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black flex-shrink-0">{scheme.category}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium line-clamp-2">{scheme.benefits}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile-Based Recommendations */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-white">Profile-Matched Schemes</h2>
                            {results && <p className="text-slate-500 font-medium text-sm mt-1">Analyzed {results.totalAnalyzed} schemes · {results.eligible?.length} fully eligible</p>}
                        </div>
                        <button
                            onClick={fetchRecommendations}
                            disabled={loading}
                            className="flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black transition-all shadow-xl shadow-primary/20 disabled:opacity-60"
                        >
                            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {loading ? 'Analyzing...' : results ? 'Refresh AI Analysis' : 'Run AI Analysis'}
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="glassmorphism rounded-3xl border-white/10 p-7 animate-pulse">
                                    <div className="h-4 bg-white/5 rounded-full w-1/3 mb-4" />
                                    <div className="h-6 bg-white/5 rounded-full w-2/3 mb-4" />
                                    <div className="h-2.5 bg-white/5 rounded-full w-full mb-4" />
                                    <div className="grid grid-cols-3 gap-4">
                                        {[...Array(3)].map((_, j) => <div key={j} className="h-14 bg-white/5 rounded-2xl" />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Summary Stats */}
                    {results && !loading && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Analyzed', value: results.totalAnalyzed, icon: <Target className="w-5 h-5" />, color: 'text-white' },
                                    { label: 'Fully Eligible', value: results.eligible?.length, icon: <CheckCircle className="w-5 h-5" />, color: 'text-emerald-400' },
                                    { label: 'Partially Eligible', value: results.partial?.length, icon: <AlertCircle className="w-5 h-5" />, color: 'text-yellow-400' },
                                    { label: 'Top Score', value: `${results.topRecommendations?.[0]?.score}/100`, icon: <Zap className="w-5 h-5" />, color: 'text-primary' },
                                ].map((stat, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                        className="glassmorphism rounded-2xl border-white/10 p-5 flex items-center gap-4">
                                        <div className={`${stat.color} bg-white/5 p-3 rounded-xl`}>{stat.icon}</div>
                                        <div>
                                            <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{stat.label}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Filter Bar */}
                            <div className="flex gap-3 flex-wrap">
                                {['all', 'eligible', 'partially eligible', 'not eligible'].map(f => (
                                    <button key={f} onClick={() => setFilterStatus(f)}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === f ? 'bg-primary text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
                                        {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label || f}
                                    </button>
                                ))}
                            </div>

                            {/* Scheme Cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {displaySchemes.map((scheme, i) => (
                                    <SchemeCard key={scheme.schemeId || i} scheme={scheme} rank={i} />
                                ))}
                            </div>

                            {displaySchemes.length === 0 && (
                                <div className="text-center py-20 text-slate-600 font-bold">No schemes match this filter.</div>
                            )}
                        </>
                    )}

                    {/* Empty State */}
                    {!results && !loading && (
                        <div className="glassmorphism rounded-[3rem] border-white/10 p-20 text-center purple-glow">
                            <Sparkles className="w-16 h-16 text-primary/40 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-white mb-3">Ready to Find Your Schemes?</h3>
                            <p className="text-slate-500 font-medium mb-8">Click "Run AI Analysis" to get personalized scheme recommendations based on your profile.</p>
                            <p className="text-xs text-slate-700 font-bold">Profile data: {user?.state || 'State not set'} · {user?.occupation || 'Occupation not set'} · ₹{user?.income?.toLocaleString() || 'Income not set'}/yr</p>
                            <Link to="/profile" className="inline-flex items-center gap-2 mt-4 text-primary text-sm font-black hover:underline">
                                Update your profile for better matching →
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default RecommendationPage;
