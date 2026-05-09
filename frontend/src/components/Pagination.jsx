import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Pagination = ({ current, total, onPageChange }) => {
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        {[...Array(total)].map((_, i) => {
          const page = i + 1;
          // Simple pagination logic to show limited pages if total is high
          if (
            page === 1 || 
            page === total || 
            (page >= current - 1 && page <= current + 1)
          ) {
            return (
              <motion.button
                key={page}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-xl border transition-all font-medium ${
                  current === page
                    ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {page}
              </motion.button>
            );
          } else if (
            page === current - 2 || 
            page === current + 2
          ) {
            return <span key={page} className="px-1 text-gray-600">...</span>;
          }
          return null;
        })}
      </div>

      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
