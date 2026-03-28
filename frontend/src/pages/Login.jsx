import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-[#020617] relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md glassmorphism rounded-3xl overflow-hidden relative z-10 purple-glow border-white/10">
        <div className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">Welcome Back</h2>
            <p className="text-slate-400 font-medium">Securely managing your governance profile.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  className="pl-12 block w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white placeholder:text-slate-600"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-300 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  className="pl-12 block w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white placeholder:text-slate-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-4 px-6 rounded-2xl shadow-xl text-lg font-bold text-white bg-primary hover:bg-primary-dark hover:purple-glow transition-all active:scale-[0.98]"
            >
              <LogIn className="w-6 h-6 mr-3" />
              Sign In
            </button>
          </form>

          <div className="mt-10 text-center">
            <span className="text-slate-500 font-medium">New to SmartGov? </span>
            <Link to="/register" className="font-bold text-primary hover:text-white transition-colors underline underline-offset-4 decoration-primary/30">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
