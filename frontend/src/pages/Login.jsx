import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

import api from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({
    userId: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID is required';
    } else {
      const upperId = formData.userId.toUpperCase();
      if (!upperId.startsWith('STU') && !upperId.startsWith('ADM')) {
        newErrors.userId = 'User ID must start with STU or ADM';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const res = await api.post('/api/auth/login', {
          userId: formData.userId,
          email: formData.email
        });
        
        const { data } = res.data;
        login(data); // Store the whole user object
        
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      } catch (err) {
        setErrors({ 
          global: err.response?.data?.error || 'Login failed - server unreachable' 
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
          <div className="mb-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(59,130,246,0.5)] border border-white/20"
            >
              <ShieldCheck className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 leading-tight">
              Smart Complaint Management System
            </h1>
            <AnimatePresence>
              {errors.global && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm mb-6 flex items-center gap-3 mt-6 text-left"
                >
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium">{errors.global}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-gray-400 mt-4 text-sm font-medium">
              Secure Access Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">User ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-white/5 border ${errors.userId ? 'border-red-500' : 'border-white/10'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500`}
                  placeholder="e.g. STU1234 or ADM001"
                />
              </div>
              {errors.userId && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-400 text-xs mt-1 ml-1">{errors.userId}</motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-400 text-xs mt-1 ml-1">{errors.email}</motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              disabled={isSubmitting}
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 flex items-center justify-center group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              <motion.div
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.div>
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Need help? <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Contact Support</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
