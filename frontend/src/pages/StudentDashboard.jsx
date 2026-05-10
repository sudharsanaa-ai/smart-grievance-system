import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ClipboardList, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Sun,
  Moon,
  Paperclip,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import api from '../api/axios';

// ─── Animation Variants ──────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const pageVariants = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
  transition: { duration: 0.2 }
};

const DashboardOverview = ({ user }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="space-y-6"
  >
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
          Welcome back, {user?.userId || 'Student'}!
        </h2>
        <p className="text-gray-400">Here's an overview of your recent activity.</p>
      </div>
      <button className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
        <Bell className="w-5 h-5 text-gray-300" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
    </div>

    {/* Dashboard Cards */}
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
    >
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -8, scale: 1.02 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-default"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <ClipboardList className="w-16 h-16 text-blue-500" />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-gray-200">Total Complaints</h3>
        </div>
        <p className="text-4xl font-bold text-white">12</p>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -8, scale: 1.02 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-default"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Clock className="w-16 h-16 text-yellow-500" />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-gray-200">Pending</h3>
        </div>
        <p className="text-4xl font-bold text-white">3</p>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -8, scale: 1.02 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-default"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <CheckCircle className="w-16 h-16 text-emerald-500" />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-gray-200">Resolved</h3>
        </div>
        <p className="text-4xl font-bold text-white">9</p>
      </motion.div>
    </motion.div>

    {/* Recent Activity */}
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg mt-8">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-400" /> Recent Activity
      </h3>
      <div className="space-y-4">
        {[
          { id: 'CMP-1042', title: 'Wifi not working in block B', status: 'Pending', time: '2 hours ago', icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { id: 'CMP-1040', title: 'Leaking tap in washroom', status: 'Resolved', time: '1 day ago', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { id: 'CMP-1035', title: 'Library AC maintenance', status: 'Resolved', time: '3 days ago', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-200">{item.title}</p>
                <p className="text-sm text-gray-500">{item.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${item.color}`}>{item.status}</p>
              <p className="text-xs text-gray-500 mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const RaiseComplaint = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    description: ''
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.message) setStatus({ type: '', message: '' });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      setStatus({ type: 'error', message: 'You can only upload up to 5 files.' });
      return;
    }

    setFiles([...files, ...selectedFiles]);

    // Generate previews
    selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, { name: file.name, url: reader.result, type: 'image' }]);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => [...prev, { name: file.name, type: 'pdf' }]);
      }
    });
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.subject || !formData.description) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const data = new FormData();
    data.append('category', formData.category);
    data.append('priority', formData.priority);
    data.append('subject', formData.subject);
    data.append('description', formData.description);
    files.forEach(file => {
      data.append('attachments', file);
    });

    try {
      const res = await api.post('/api/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const resData = res.data;

      setStatus({ type: 'success', message: `Complaint submitted successfully! ID: ${resData.data.complaintId}` });
      setFormData({ category: '', priority: 'medium', subject: '', description: '' });
      setFiles([]);
      setPreviews([]);
      
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.error || error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-lg max-w-3xl"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <div className="p-2 bg-emerald-500/20 rounded-xl">
            <PlusCircle className="w-6 h-6 text-emerald-400" />
          </div>
          Raise New Complaint
        </h2>
        <p className="text-gray-400 mt-2 ml-10">Fill out the details below to submit a new grievance.</p>
      </div>

      {status.message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            status.type === 'error' 
              ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
              : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
          }`}
        >
          {status.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          {status.message}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Category *</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white appearance-none"
            >
              <option value="" className="bg-[#0f172a]">Select Category</option>
              <option value="hostel" className="bg-[#0f172a]">Hostel & Accommodation</option>
              <option value="academic" className="bg-[#0f172a]">Academic & Departments</option>
              <option value="infrastructure" className="bg-[#0f172a]">Infrastructure & IT</option>
              <option value="other" className="bg-[#0f172a]">Other Services</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Priority</label>
            <select 
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white appearance-none"
            >
              <option value="low" className="bg-[#0f172a]">Low</option>
              <option value="medium" className="bg-[#0f172a]">Medium</option>
              <option value="high" className="bg-[#0f172a]">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Subject *</label>
          <input 
            type="text" 
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Brief summary of the issue"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Description *</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4" 
            placeholder="Provide detailed information about your grievance..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500 resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Attachments (Max 5)</label>
          <div className="flex flex-wrap gap-4 mb-4">
            <AnimatePresence>
              {previews.map((preview, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center group"
                >
                  {preview.type === 'image' ? (
                    <img src={preview.url} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <FileText className="w-8 h-8 text-indigo-400" />
                      <span className="text-[10px] text-gray-500 px-2 truncate w-full text-center">{preview.name}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {files.length < 5 && (
              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center cursor-pointer group">
                <Paperclip className="w-6 h-6 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                <span className="text-[10px] text-gray-500 mt-1">Upload</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*,.pdf" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`py-3 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 flex items-center justify-center transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

const ComplaintStatus = () => {
  const { socket } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchComplaints = async (p = page) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/complaints?page=${p}&limit=5`);
      setComplaints(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(page);
  }, [page]);

  // Real-time updates via Socket.io
  useEffect(() => {
    if (socket) {
      const handleStatusUpdate = (data) => {
        setComplaints((prev) => 
          prev.map((c) => 
            c.complaintId === data.complaintId ? { ...c, status: data.newStatus } : c
          )
        );
      };

      socket.on('statusUpdated', handleStatusUpdate);

      return () => {
        socket.off('statusUpdated', handleStatusUpdate);
      };
    }
  }, [socket]);

  const getStatusStep = (status) => {
    if (status === 'Submitted') return 1;
    if (status === 'Pending') return 2;
    if (status === 'Resolved') return 3;
    if (status === 'Rejected') return -1;
    return 1;
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div className="mb-6 flex items-center gap-2">
        <div className="p-2 bg-blue-500/20 rounded-xl">
          <ClipboardList className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100">Track Complaints</h2>
      </div>

      {loading ? (
        <Loader />
      ) : complaints.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 text-center shadow-lg">
          <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300">No complaints yet</h3>
          <p className="text-gray-500 mt-2">You haven't submitted any grievances.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {complaints.map((complaint) => {
            const step = getStatusStep(complaint.status);
            const isRejected = step === -1;

            return (
              <motion.div 
                key={complaint._id}
                whileHover={{ y: -5 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-lg relative overflow-hidden"
              >
                {/* Decorative background glow based on status */}
                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 pointer-events-none rounded-full ${
                  isRejected ? 'bg-red-500' : 
                  step === 3 ? 'bg-emerald-500' : 
                  step === 2 ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">{complaint.complaintId}</span>
                    <h3 className="text-lg font-bold text-gray-200 mt-1">{complaint.subject}</h3>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> 
                      {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                    complaint.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    complaint.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {complaint.priority}
                  </span>
                </div>

                {/* Timeline UI */}
                <div className="relative pt-6">
                  {/* Connecting Line background */}
                  <div className="absolute top-[34px] left-[10%] right-[10%] h-1 bg-white/10 rounded-full" />
                  
                  {/* Active Connecting Line */}
                  {!isRejected && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute top-[34px] left-[10%] right-[10%] h-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-emerald-500 origin-left rounded-full" 
                    />
                  )}

                  <div className="flex justify-between relative z-10">
                    {/* Step 1: Submitted */}
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-4 ${
                        isRejected ? 'bg-white/10 border-white/20' :
                        step >= 1 ? 'bg-blue-500 border-[#0f172a]' : 'bg-white/10 border-white/20'
                      }`}>
                        {step > 1 && !isRejected ? <CheckCircle className="w-3 h-3 text-[#0f172a]" /> : null}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${isRejected ? 'text-gray-500' : step >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>Submitted</span>
                    </div>

                    {/* Step 2: Processing (Pending) */}
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-4 ${
                        isRejected ? 'bg-red-500 border-[#0f172a]' :
                        step >= 2 ? 'bg-yellow-400 border-[#0f172a]' : 'bg-white/10 border-[#0f172a]'
                      }`}>
                         {step > 2 && !isRejected ? <CheckCircle className="w-3 h-3 text-[#0f172a]" /> : null}
                         {isRejected ? <AlertCircle className="w-3 h-3 text-[#0f172a]" /> : null}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${
                        isRejected ? 'text-red-400' : 
                        step >= 2 ? 'text-yellow-400' : 'text-gray-500'
                      }`}>
                        {isRejected ? 'Rejected' : 'Processing'}
                      </span>
                    </div>

                    {/* Step 3: Done (Resolved) */}
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-4 ${
                        isRejected ? 'bg-white/10 border-white/20 opacity-30' :
                        step >= 3 ? 'bg-emerald-500 border-[#0f172a]' : 'bg-white/10 border-[#0f172a]'
                      }`}>
                         {step >= 3 && !isRejected ? <CheckCircle className="w-3 h-3 text-[#0f172a]" /> : null}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${isRejected ? 'text-gray-500 opacity-30' : step >= 3 ? 'text-emerald-400' : 'text-gray-500'}`}>Done</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && complaints.length > 0 && (
        <Pagination 
          current={page} 
          total={pagination.pages} 
          onPageChange={setPage} 
        />
      )}
    </motion.div>
  );
};


const StudentDashboard = () => {
  const { user, logout, socket } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setToast] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for real-time status updates
  useEffect(() => {
    if (socket) {
      const handleStatusUpdate = (data) => {
        const newNotify = {
          id: Date.now(),
          title: 'Complaint Updated',
          message: `Complaint ${data.complaintId} is now ${data.newStatus}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          type: 'status'
        };

        setNotifications(prev => [newNotify, ...prev]);
        setToast({
          title: 'Status Update',
          message: `Your complaint ${data.complaintId} status changed to ${data.newStatus}`,
          type: 'info'
        });
        
        setTimeout(() => setToast(null), 5000);
      };

      socket.on('statusUpdated', handleStatusUpdate);
      return () => socket.off('statusUpdated', handleStatusUpdate);
    }
  }, [socket]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'raise', label: 'Raise Complaint', icon: PlusCircle },
    { id: 'status', label: 'Complaint Status', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden transition-colors duration-300">
      {/* Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-600/10 blur-[120px] pointer-events-none" />

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 backdrop-blur-xl bg-white/5 border-r border-white/10 relative z-20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Smart Grievance</h1>
              <p className="text-xs text-emerald-400 font-medium">Student Portal</p>
            </div>
          </div>
        </div>

        <motion.nav 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 py-6 px-4 space-y-2"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-400 font-medium' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : ''}`} />
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 backdrop-blur-xl bg-white/5 border-b border-white/10 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="font-bold text-sm">S</span>
          </div>
          <h1 className="font-bold text-md tracking-tight">Student Portal</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme Toggle Mobile */}
          <button 
            onClick={toggleTheme}
            className="p-2 bg-white/5 rounded-lg border border-white/10 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
          {/* Notification Bell Mobile */}
          <button 
            onClick={() => setIsNotifyOpen(!isNotifyOpen)}
            className="p-2 bg-white/5 rounded-lg border border-white/10 relative"
          >
            <Bell className="w-5 h-5 text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] flex items-center justify-center rounded-full border-2 border-[#0f172a]">
                {unreadCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-white/5 rounded-lg border border-white/10"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 right-0 bottom-0 backdrop-blur-xl bg-[#0f172a]/95 z-20 p-4"
          >
            <nav className="space-y-2 mt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-emerald-500/20 text-emerald-400 font-medium' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-8"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-20 md:pt-8 p-4 md:p-8 relative z-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto relative">
          
          {/* Desktop Header / Notification Bell */}
          <div className="hidden md:flex justify-end mb-6 items-center gap-3">
            {/* Theme Toggle Desktop */}
            <button 
              onClick={toggleTheme}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group"
            >
              {theme === 'dark' ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-indigo-600" />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all relative group"
              >
                <Bell className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0f172a]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown (Common for both Mobile Toggle and Desktop Bell) */}
              <AnimatePresence>
                {isNotifyOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-80 backdrop-blur-2xl bg-[#1e293b]/95 border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h3 className="font-bold">Notifications</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-xs text-emerald-400 hover:text-emerald-300"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 text-sm">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-emerald-500/5' : ''}`}
                            >
                              <div className="flex gap-3">
                                <div className={`p-2 rounded-xl h-fit ${n.type === 'status' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                  <Bell className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-100">{n.title}</p>
                                  <p className="text-xs text-gray-400 mt-1">{n.message}</p>
                                  <p className="text-[10px] text-gray-600 mt-2">{n.time}</p>
                                </div>
                                {!n.read && (
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsNotifyOpen(false)} 
                    />
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardOverview key="overview" user={user} />}
            {activeTab === 'raise' && <RaiseComplaint key="raise" />}
            {activeTab === 'status' && <ComplaintStatus key="status" />}
          </AnimatePresence>
        </div>
      </main>

      {/* Real-time Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Bell className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-100">{notification.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                <button 
                  onClick={() => setNotification(null)}
                  className="mt-3 text-xs font-medium text-blue-400 hover:text-blue-300"
                >
                  Dismiss
                </button>
              </div>
              <button onClick={() => setNotification(null)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default StudentDashboard;

