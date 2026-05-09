import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border border-red-500/30 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(255,0,0,0.1)] text-center max-w-md w-full"
      >
        <div className="w-20 h-20 bg-red-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-red-400 mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-8">
          You don't have permission to view this page. Please contact an administrator if you believe this is a mistake.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back
        </button>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
