import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { User, Mail, Shield, LogOut, CheckCircle, Edit3, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        age: user?.age || '',
        income: user?.income || '',
        state: user?.state || '',
        occupation: user?.occupation || '',
        category: user?.category || '',
    });

    if (!user) return null;

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.put('/auth/me', form);
            if (setUser) setUser(res.data);
            toast.success('Profile updated successfully!');
            setEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const profileFields = [
        { label: 'Age', key: 'age', type: 'number' },
        { label: 'Annual Income (₹)', key: 'income', type: 'number' },
        { label: 'State', key: 'state', type: 'text' },
        { label: 'Occupation', key: 'occupation', type: 'text' },
        { label: 'Category', key: 'category', type: 'text' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Card */}
                <div className="glassmorphism rounded-[2.5rem] border-white/10 overflow-hidden purple-glow relative">
                    <div className="bg-gradient-to-br from-primary via-secondary to-primary-dark h-48 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,.05) 0, rgba(255,255,255,.05) 1px, transparent 0, transparent 50%)", backgroundSize: "8px 8px" }} />
                        <div className="absolute -bottom-16 left-12 flex items-end">
                            <div className="p-2 bg-[#020617] rounded-[2rem]">
                                <div className="bg-slate-900 border border-white/10 rounded-[1.8rem] p-8 shadow-2xl">
                                    <User className="w-20 h-20 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-24 pb-10 px-12">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tight">{user.name}</h1>
                                <p className="text-slate-400 font-medium flex items-center mt-2 text-lg">
                                    <Mail className="w-5 h-5 mr-3 text-primary" /> {user.email}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <span className="bg-primary/10 text-primary px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border border-primary/20 flex items-center">
                                    <Shield className="w-4 h-4 mr-2" /> {user.role}
                                </span>
                                {!editing ? (
                                    <button onClick={() => setEditing(true)} className="bg-white/5 hover:bg-primary/10 text-slate-400 hover:text-primary px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border border-white/10 hover:border-primary/30 flex items-center transition-all">
                                        <Edit3 className="w-4 h-4 mr-2" /> Edit
                                    </button>
                                ) : (
                                    <button onClick={() => setEditing(false)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border border-red-500/20 flex items-center transition-all">
                                        <X className="w-4 h-4 mr-2" /> Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details / Edit Form */}
                <div className="glassmorphism rounded-[2.5rem] border-white/10 p-10">
                    <h2 className="text-xl font-black text-white uppercase tracking-widest text-xs text-primary mb-8">Eligibility Profile</h2>
                    {editing ? (
                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {profileFields.map(f => (
                                <div key={f.key} className="space-y-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">{f.label}</label>
                                    <input
                                        type={f.type}
                                        name={f.key}
                                        value={form[f.key]}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                    />
                                </div>
                            ))}
                            <div className="md:col-span-2">
                                <button type="submit" disabled={saving} className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-60">
                                    <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {profileFields.map(f => (
                                <div key={f.key} className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">{f.label}</p>
                                    <p className="text-white font-black text-lg">{user[f.key] || <span className="text-slate-600 font-normal text-sm">Not set</span>}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Dashboard', to: '/dashboard', color: 'primary' },
                        { label: 'Schemes', to: '/schemes', color: 'secondary' },
                        { label: 'Document Vault', to: '/vault', color: 'primary' },
                        { label: 'News Feed', to: '/news', color: 'secondary' },
                    ].map(q => (
                        <Link key={q.to} to={q.to} className={`glassmorphism p-5 rounded-2xl border-white/10 text-center hover:border-${q.color}/30 hover:bg-${q.color}/5 transition-all group`}>
                            <CheckCircle className={`w-5 h-5 text-${q.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                            <span className="text-xs font-black text-slate-400 group-hover:text-white uppercase tracking-widest">{q.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Danger Zone */}
                <div className="glassmorphism rounded-3xl border-red-500/10 p-8 bg-red-500/5">
                    <h3 className="text-xs font-black text-red-400 uppercase tracking-widest mb-4">Account Actions</h3>
                    <button onClick={() => { logout(); navigate('/login'); }} className="px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl font-black text-sm border border-red-500/20 transition-all flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Sign Out from SmartGov
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
