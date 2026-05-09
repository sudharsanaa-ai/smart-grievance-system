import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  RefreshCw,
  Users,
  BarChart3,
  Bell,
  ChevronRight,
  Sun,
  Moon,
  ChevronLeft,
  Paperclip,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import api from '../api/axios';

const AnalyticsDashboard = lazy(() => import('../components/AnalyticsDashboard'));

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

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden group cursor-default"
  >
    <div className={`absolute -top-4 -right-4 w-24 h-24 ${bg} blur-3xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full`} />
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 ${bg} bg-opacity-20 rounded-xl`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    <p className="text-4xl font-bold text-white">{value}</p>
    <p className="text-sm text-gray-400 mt-1">{label}</p>
  </motion.div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Submitted: 'bg-blue-500/20 text-blue-400',
    Pending:   'bg-yellow-500/20 text-yellow-400',
    Resolved:  'bg-emerald-500/20 text-emerald-400',
    Rejected:  'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${map[status] || 'bg-white/10 text-gray-400'}`}>
      {status}
    </span>
  );
};

// ─── Priority Badge ───────────────────────────────────────────────────────────
const PriorityBadge = ({ priority }) => {
  const map = {
    high:   'bg-red-500/20 text-red-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low:    'bg-emerald-500/20 text-emerald-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${map[priority] || 'bg-white/10 text-gray-400'}`}>
      {priority}
    </span>
  );
};

// ─── Status Dropdown ──────────────────────────────────────────────────────────
const StatusDropdown = ({ complaint, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const statuses = ['Submitted', 'Pending', 'Resolved', 'Rejected'];

  const handleSelect = async (newStatus) => {
    if (newStatus === complaint.status) { setOpen(false); return; }
    setUpdating(true);
    setOpen(false);
    await onUpdate(complaint._id, newStatus);
    setUpdating(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={updating}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-colors disabled:opacity-50"
      >
        {updating ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
        <StatusBadge status={complaint.status} />
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-40 backdrop-blur-xl bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => handleSelect(s)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors ${complaint.status === s ? 'text-indigo-400 font-semibold' : 'text-gray-300'}`}
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
};

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user, token, logout, socket } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const unreadCount = notifications.filter(n => !n.read).length;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchComplaints = async (p = page) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/complaints/all?page=${p}&limit=10`);
      setComplaints(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to fetch complaints', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(page); }, [token, page]);

  // Real-time updates via Socket.io
  useEffect(() => {
    if (socket) {
      // Listen for new complaints
      const handleNewComplaint = (complaint) => {
        setComplaints((prev) => [complaint, ...prev]);
        const newNotify = {
          id: Date.now(),
          title: 'New Complaint',
          message: `${complaint.complaintId}: ${complaint.subject}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          type: 'new'
        };
        setNotifications(prev => [newNotify, ...prev]);
        showToast('New complaint received!');
      };

      // Listen for updates from other admins
      const handleComplaintUpdated = (updated) => {
        setComplaints((prev) => 
          prev.map((c) => c._id === updated._id ? updated : c)
        );
      };

      socket.on('newComplaint', handleNewComplaint);
      socket.on('complaintUpdated', handleComplaintUpdated);

      return () => {
        socket.off('newComplaint', handleNewComplaint);
        socket.off('complaintUpdated', handleComplaintUpdated);
      };
    }
  }, [socket]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await api.patch(`/api/complaints/${id}/status`, { status: newStatus });
      setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
      showToast(`Status updated to "${newStatus}"`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Update failed', 'error');
    }
  };

  // Stats derived from data
  const stats = useMemo(() => ({
    total:    complaints.length,
    pending:  complaints.filter(c => c.status === 'Pending').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    highPrio: complaints.filter(c => c.priority === 'high').length,
  }), [complaints]);

  // Filtered complaints
  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const matchSearch = !searchTerm ||
        c.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.complaintId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user?.userId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus   = filterStatus === 'All'   || c.status === filterStatus;
      const matchPriority = filterPriority === 'All' || c.priority === filterPriority;
      const matchCategory = filterCategory === 'All' || c.category === filterCategory;
      const matchDate     = !filterDate || new Date(c.createdAt).toLocaleDateString() === new Date(filterDate).toLocaleDateString() || new Date(c.createdAt) >= new Date(filterDate);
      
      return matchSearch && matchStatus && matchPriority && matchCategory && matchDate;
    });
  }, [complaints, searchTerm, filterStatus, filterPriority, filterCategory, filterDate]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard',   icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics',   icon: BarChart3 },
    { id: 'complaints', label: 'All Complaints', icon: ClipboardList },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Smart Grievance</h1>
            <p className="text-xs text-indigo-400 font-medium">Admin Portal</p>
          </div>
        </div>
      </div>
      <motion.nav 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 py-6 px-4 space-y-1"
      >
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <motion.button
              key={id}
              variants={itemVariants}
              whileHover={{ x: 4 }}
              onClick={() => { setActiveTab(id); setIsMobileOpen(false); }}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                active ? 'bg-indigo-500/20 text-indigo-300 font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              {active && (
                <motion.div layoutId="adminIndicator" className="absolute left-0 w-1 h-7 bg-indigo-500 rounded-r-full" />
              )}
              <Icon className="w-5 h-5" />
              {label}
            </motion.button>
          );
        })}
      </motion.nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/5">
          <div className="w-8 h-8 bg-indigo-500/30 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-indigo-300" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-200">{user?.userId || 'Admin'}</p>
            <p className="text-xs text-indigo-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex overflow-hidden transition-colors duration-300">
      {/* Background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 backdrop-blur-xl bg-white/5 border-r border-white/10 relative z-20 min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 backdrop-blur-xl bg-white/5 border-b border-white/10 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-sm">A</span>
          </div>
          <h1 className="font-bold">Admin Portal</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme Toggle Mobile */}
          <button 
            onClick={toggleTheme}
            className="p-2 bg-white/5 rounded-lg border border-white/10 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
          {/* Mobile Notification Bell */}
          <button 
            onClick={() => setIsNotifyOpen(!isNotifyOpen)}
            className="p-2 bg-white/5 rounded-lg border border-white/10 relative"
          >
            <Bell className="w-5 h-5 text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-[10px] flex items-center justify-center rounded-full border-2 border-[#0f172a]">
                {unreadCount}
              </span>
            )}
          </button>
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 bg-white/5 rounded-lg border border-white/10">
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -280 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden fixed top-0 left-0 bottom-0 w-72 backdrop-blur-xl bg-[#0f172a]/95 border-r border-white/10 z-40 flex flex-col"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
      {isMobileOpen && <div className="md:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setIsMobileOpen(false)} />}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-5 left-1/2 z-50 px-6 py-3 rounded-2xl text-sm font-medium shadow-2xl flex items-center gap-2 ${
              toast.type === 'error'
                ? 'bg-red-500/20 border border-red-500/40 text-red-300'
                : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
            }`}
          >
            {toast.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-20 md:pt-8 p-4 md:p-8 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto relative">
          
          {/* Desktop Notification Bell */}
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
                  <span className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0f172a]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
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
                            className="text-xs text-indigo-400 hover:text-indigo-300"
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
                              className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-500/5' : ''}`}
                            >
                              <div className="flex gap-3">
                                <div className={`p-2 rounded-xl h-fit ${n.type === 'new' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                  <Bell className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-100">{n.title}</p>
                                  <p className="text-xs text-gray-400 mt-1">{n.message}</p>
                                  <p className="text-[10px] text-gray-600 mt-2">{n.time}</p>
                                </div>
                                {!n.read && (
                                  <div className="w-2 h-2 bg-indigo-50 rounded-full mt-2" />
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

            {/* ── Dashboard Overview ── */}
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dash" 
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    Admin Overview
                  </h2>
                  <p className="text-gray-400 mt-1">Real-time snapshot of all grievances in the system.</p>
                </div>

                {/* Stat Cards */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                >
                  <StatCard icon={ClipboardList}  label="Total Complaints"    value={stats.total}    color="text-indigo-400"  bg="bg-indigo-500" />
                  <StatCard icon={Clock}          label="Pending"             value={stats.pending}  color="text-yellow-400"  bg="bg-yellow-500" />
                  <StatCard icon={CheckCircle2}   label="Resolved"            value={stats.resolved} color="text-emerald-400" bg="bg-emerald-500" />
                  <StatCard icon={AlertTriangle}  label="High Priority"       value={stats.highPrio} color="text-red-400"     bg="bg-red-500" />
                </motion.div>

                {/* Recent complaints preview */}
                <motion.div 
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-lg"
                >
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-400" /> Recent Complaints
                    </h3>
                    <button
                      onClick={() => setActiveTab('complaints')}
                      className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="divide-y divide-white/5">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : complaints.slice(0, 5).map((c) => (
                      <div key={c._id} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-200">{c.subject}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{c.complaintId} · {c.user?.userId}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <PriorityBadge priority={c.priority} />
                          <StatusBadge status={c.status} />
                        </div>
                      </div>
                    ))}
                    {!loading && complaints.length === 0 && (
                      <div className="text-center py-10 text-gray-500">No complaints in the system yet.</div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ── Analytics ── */}
            {activeTab === 'analytics' && (
              <motion.div 
                key="analytics" 
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Suspense fallback={<Loader />}>
                  <AnalyticsDashboard complaints={complaints} />
                </Suspense>
              </motion.div>
            )}

            {/* ── All Complaints ── */}
            {activeTab === 'complaints' && (
              <motion.div key="complaints" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                      All Complaints
                    </h2>
                    <p className="text-gray-400 mt-1">{filtered.length} of {complaints.length} complaints shown</p>
                  </div>
                  <button
                    onClick={fetchComplaints}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                  </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by subject, ID or student ID..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 transition-all text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-white text-sm appearance-none cursor-pointer"
                      >
                        {['All Status', 'Submitted', 'Pending', 'Resolved', 'Rejected'].map(s => (
                          <option key={s} value={s === 'All Status' ? 'All' : s} className="bg-[#1e293b]">{s}</option>
                        ))}
                      </select>
                    </div>
                    
                    <select
                      value={filterPriority}
                      onChange={e => setFilterPriority(e.target.value)}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-white text-sm appearance-none cursor-pointer"
                    >
                      {['All Priority', 'high', 'medium', 'low'].map(p => (
                        <option key={p} value={p === 'All Priority' ? 'All' : p} className="bg-[#1e293b] capitalize">{p}</option>
                      ))}
                    </select>

                    <select
                      value={filterCategory}
                      onChange={e => setFilterCategory(e.target.value)}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-white text-sm appearance-none cursor-pointer"
                    >
                      {['All Categories', 'academic', 'hostel', 'infrastructure', 'other'].map(c => (
                        <option key={c} value={c === 'All Categories' ? 'All' : c} className="bg-[#1e293b] capitalize">{c}</option>
                      ))}
                    </select>

                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="date"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-white text-sm appearance-none cursor-pointer [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(searchTerm || filterStatus !== 'All' || filterPriority !== 'All' || filterCategory !== 'All' || filterDate) && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('All');
                        setFilterPriority('All');
                        setFilterCategory('All');
                        setFilterDate('');
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3 h-3" /> Clear all filters
                    </button>
                  </motion.div>
                )}

                {/* Complaints Table */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-lg">
                  {loading ? (
                    <Loader />
                  ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 font-medium">No complaints match your filters.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[700px]">
                        <thead>
                          <tr className="bg-white/5 text-xs text-gray-400 uppercase tracking-wider">
                            <th className="px-6 py-4 font-medium">ID</th>
                            <th className="px-6 py-4 font-medium">Student</th>
                            <th className="px-6 py-4 font-medium">Subject</th>
                            <th className="px-6 py-4 font-medium">Category</th>
                            <th className="px-6 py-4 font-medium">Priority</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium"><Paperclip className="w-4 h-4" /></th>
                            <th className="px-6 py-4 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filtered.map((c, idx) => (
                            <motion.tr
                              key={c._id}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              transition={{ delay: idx * 0.03 }}
                              className="hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0"
                            >
                              <td className="px-6 py-4 text-xs font-mono font-bold text-indigo-400">{c.complaintId}</td>
                              <td className="px-6 py-4 text-sm text-gray-300">{c.user?.userId || 'N/A'}</td>
                              <td className="px-6 py-4 text-sm text-gray-200 max-w-[200px] truncate" title={c.subject}>{c.subject}</td>
                              <td className="px-6 py-4 text-sm text-gray-400 capitalize">{c.category}</td>
                              <td className="px-6 py-4"><PriorityBadge priority={c.priority} /></td>
                              <td className="px-6 py-4 text-xs text-gray-500">
                                {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  {c.attachments && c.attachments.length > 0 ? (
                                    c.attachments.map((file, i) => (
                                      <a 
                                        key={i} 
                                        href={file.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors group/file"
                                        title={file.name}
                                      >
                                        {file.url.endsWith('.pdf') ? (
                                          <FileText className="w-4 h-4 text-red-400" />
                                        ) : (
                                          <Paperclip className="w-4 h-4 text-indigo-400" />
                                        )}
                                      </a>
                                    ))
                                  ) : (
                                    <span className="text-xs text-gray-600 italic">None</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <StatusDropdown complaint={c} onUpdate={handleStatusUpdate} />
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                
                {/* Pagination Controls */}
                {!loading && filtered.length > 0 && (
                  <Pagination 
                    current={page} 
                    total={pagination.pages} 
                    onPageChange={setPage} 
                  />
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

