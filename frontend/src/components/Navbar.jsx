import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Building2, User, LogOut, Moon, Sun, Globe, Bell, Newspaper, Calculator, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'New Scheme: PM Awas Yojana updated rules.', time: '2h ago', dot: 'bg-primary' },
    { id: 2, text: 'Application approved! Check your Dashboard.', time: '1d ago', dot: 'bg-emerald-400' },
    { id: 3, text: 'Complete your profile for better AI matching.', time: '3d ago', dot: 'bg-yellow-400' },
  ];

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleLogout = () => { logout(); navigate('/login'); setMobileOpen(false); };
  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  const isActive = (path) => location.pathname === path;

  const navLink = (to, label, icon) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${isActive(to) ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {label}
    </Link>
  );

  return (
    <nav className="bg-[#020617]/80 backdrop-blur-xl border-b border-purple-500/10 w-full sticky top-0 z-50 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex flex-shrink-0 items-center group">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl purple-glow group-hover:scale-110 transition-transform duration-300">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 font-bold text-2xl text-white tracking-tight bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all">
              {t('smartGovAssist')}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLink('/schemes', 'Schemes')}
            {navLink('/recommendations', 'AI Recommended', <Sparkles className="w-4 h-4" />)}
            {navLink('/news', 'News', <Newspaper className="w-4 h-4" />)}
            {navLink('/calculator', 'Calculator', <Calculator className="w-4 h-4" />)}
            {user && navLink('/dashboard', 'Dashboard')}
            {user && navLink('/vault', 'Vault')}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button onClick={toggleLanguage} className="hidden sm:flex p-2.5 items-center space-x-1 rounded-xl bg-white/5 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all font-bold text-xs border border-white/5" title="Change Language">
              <Globe className="w-4 h-4" />
              <span>{i18n.language === 'en' ? 'HI' : 'EN'}</span>
            </button>

            <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all border border-white/5" title="Toggle Dark Mode">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user && (
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all relative border border-white/5">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#020617]" />
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 glassmorphism rounded-2xl overflow-hidden z-[60] border border-white/10"
                    >
                      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-primary/10">
                        <span className="font-black text-white text-sm">Notifications</span>
                        <span className="text-xs text-primary font-bold cursor-pointer hover:underline">Mark all read</span>
                      </div>
                      {notifications.map(n => (
                        <div key={n.id} className="p-4 hover:bg-primary/5 transition-colors border-b border-white/5 last:border-0 cursor-pointer flex gap-3">
                          <div className={`w-2 h-2 rounded-full ${n.dot} mt-1.5 flex-shrink-0`} />
                          <div>
                            <p className="text-sm text-slate-300 font-medium">{n.text}</p>
                            <span className="text-[10px] text-slate-500 mt-1 block uppercase tracking-wider">{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {user ? (
              <div className="hidden md:flex items-center space-x-2 ml-2 bg-white/5 p-1.5 pl-4 pr-2 rounded-2xl border border-white/5">
                <span className="text-sm font-bold text-white max-w-[90px] truncate">{user.name}</span>
                <Link to="/profile" className="p-2 bg-white/10 rounded-xl text-slate-400 hover:text-primary transition-all" title="Profile">
                  <User className="h-4 w-4" />
                </Link>
                <button onClick={handleLogout} className="p-2 bg-white/10 rounded-xl text-slate-400 hover:text-red-500 transition-all" title="Logout">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2 ml-2">
                <Link to="/login" className="text-slate-300 hover:text-primary px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-white/10 hover:border-primary/30">Login</Link>
                <Link to="/register" className="bg-primary text-white hover:bg-primary-dark px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20">Sign Up</Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-primary transition-all border border-white/5">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-[#020617]/95 backdrop-blur-xl px-4 pb-6 pt-4 space-y-2"
          >
            {navLink('/schemes', 'Schemes')}
            {navLink('/recommendations', 'AI Recommendations', <Sparkles className="w-4 h-4" />)}
            {navLink('/news', 'Policy News', <Newspaper className="w-4 h-4" />)}
            {navLink('/calculator', 'Eligibility Calculator', <Calculator className="w-4 h-4" />)}
            {user && navLink('/dashboard', 'Dashboard')}
            {user && navLink('/vault', 'Document Vault')}
            {user && navLink('/profile', 'Profile')}
            <div className="pt-4 border-t border-white/5">
              {user ? (
                <button onClick={handleLogout} className="w-full text-left text-sm font-bold text-red-400 hover:text-red-300 px-3 py-2 flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out ({user.name})
                </button>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 bg-white/5 text-slate-300 rounded-xl font-bold text-sm">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 bg-primary text-white rounded-xl font-bold text-sm">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
