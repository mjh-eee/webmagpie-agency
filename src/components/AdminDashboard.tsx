import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Calendar, Plus, Edit2, Trash2, Mail,
  Settings, Check, X, FileText, Activity, Layers, ShieldAlert, TrendingUp, HelpCircle, Image
} from 'lucide-react';
import { Doctor, Department, Appointment, Blog, ContactMessage, User, ClinicSettings, FAQ, Testimonial, GalleryItem } from '../types';

interface AdminDashboardProps {
  token: string | null;
  doctors: Doctor[];
  departments: Department[];
  blogs: Blog[];
  users: User[];
  faqs: FAQ[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  settings: ClinicSettings;
  onRefreshData: () => void;
}

export default function AdminDashboard({
  token,
  doctors,
  departments,
  blogs,
  settings,
  onRefreshData
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'appointments' | 'doctors' | 'departments' | 'blogs' | 'messages' | 'settings'>('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states for creating/editing Doctor
  const [docModal, setDocModal] = useState<{ open: boolean; editId?: string }>({ open: false });
  const [docForm, setDocForm] = useState({
    name: '', specialization: '', departmentId: '', experience: 5, bio: '', availableDays: 'Monday, Wednesday, Friday', availableSlots: '10:00 AM, 11:00 AM, 02:00 PM', fee: 100, image: ''
  });

  // Form states for creating Department
  const [deptModal, setDeptModal] = useState({ open: false });
  const [deptForm, setDeptForm] = useState({ name: '', description: '', iconName: 'Activity' });

  // Form states for creating Blog
  const [blogModal, setBlogModal] = useState<{ open: boolean; editId?: string }>({ open: false });
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', content: '', category: 'Cardiology', author: 'Dr. Sarah Connor', image: '', readTime: '5 min read' });

  // Clinic Settings Form states
  const [settingsForm, setSettingsForm] = useState<ClinicSettings>({ ...settings });

  // Fetch admin-only resources
  useEffect(() => {
    if (!token) return;
    fetchAnalytics();
    fetchAppointments();
    fetchMessages();
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error('Error fetching analytics:', e);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (e) {
      console.error('Error fetching appointments:', e);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact-messages', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error('Error fetching messages:', e);
    }
  };

  // Appointment Status action
  const handleAptStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAppointments();
        fetchAnalytics();
      }
    } catch (e) {
      console.error('Error updating appointment:', e);
    }
  };

  // Delete Appointment Action
  const handleDeleteApt = async (id: string) => {
    if (!window.confirm('Delete this appointment record entirely?')) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAppointments();
        fetchAnalytics();
      }
    } catch (e) {
      console.error('Error deleting appointment:', e);
    }
  };

  // Create or Update Doctor
  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...docForm,
      experience: Number(docForm.experience),
      fee: Number(docForm.fee),
      availableDays: docForm.availableDays.split(',').map(s => s.trim()),
      availableSlots: docForm.availableSlots.split(',').map(s => s.trim())
    };

    try {
      const isEdit = !!docModal.editId;
      const url = isEdit ? `/api/doctors/${docModal.editId}` : '/api/doctors';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setDocModal({ open: false });
        onRefreshData();
        fetchAnalytics();
        // Reset
        setDocForm({ name: '', specialization: '', departmentId: '', experience: 5, bio: '', availableDays: 'Monday, Wednesday, Friday', availableSlots: '10:00 AM, 11:00 AM, 02:00 PM', fee: 100, image: '' });
      }
    } catch (e) {
      console.error('Error saving doctor:', e);
    }
  };

  const handleEditDoc = (doc: Doctor) => {
    setDocForm({
      name: doc.name,
      specialization: doc.specialization,
      departmentId: doc.departmentId,
      experience: doc.experience,
      bio: doc.bio,
      availableDays: doc.availableDays.join(', '),
      availableSlots: doc.availableSlots.join(', '),
      fee: doc.fee,
      image: doc.image
    });
    setDocModal({ open: true, editId: doc.id });
  };

  const handleDeleteDoc = async (id: string) => {
    if (!window.confirm('Delete doctor profile? This is irreversible.')) return;
    try {
      const res = await fetch(`/api/doctors/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        onRefreshData();
        fetchAnalytics();
      }
    } catch (e) {
      console.error('Error deleting doctor:', e);
    }
  };

  // Create Department
  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(deptForm)
      });
      if (res.ok) {
        setDeptModal({ open: false });
        onRefreshData();
        fetchAnalytics();
        setDeptForm({ name: '', description: '', iconName: 'Activity' });
      }
    } catch (e) {
      console.error('Error saving department:', e);
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      const res = await fetch(`/api/departments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        onRefreshData();
        fetchAnalytics();
      }
    } catch (e) {
      console.error('Error deleting dept:', e);
    }
  };

  // Create or Edit Blog
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!blogModal.editId;
      const url = isEdit ? `/api/blogs/${blogModal.editId}` : '/api/blogs';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blogForm)
      });
      if (res.ok) {
        setBlogModal({ open: false });
        onRefreshData();
        setBlogForm({ title: '', excerpt: '', content: '', category: 'Cardiology', author: 'Dr. Sarah Connor', image: '', readTime: '5 min read' });
      }
    } catch (e) {
      console.error('Error saving blog:', e);
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setBlogForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      author: blog.author,
      image: blog.image,
      readTime: blog.readTime
    });
    setBlogModal({ open: true, editId: blog.id });
  };

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (e) {
      console.error('Error deleting blog:', e);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        alert('Agency and SEO Settings saved successfully!');
        onRefreshData();
      }
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  };

  // Resolve message status
  const handleMarkMessage = async (id: string, status: 'read' | 'replied') => {
    try {
      const res = await fetch(`/api/contact-messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch (e) {
      console.error('Error updating message:', e);
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Side menu */}
        <aside className="w-full md:w-64 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 space-y-2 shrink-0">
          <div className="flex items-center gap-2 px-3 pb-4 mb-4 border-b border-slate-200/60 dark:border-slate-800">
            <LayoutDashboard className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Management Console</span>
          </div>

          {[
            { id: 'overview', label: 'Console Overview', icon: LayoutDashboard },
            { id: 'appointments', label: 'Bookings & Retainers', icon: Calendar },
            { id: 'doctors', label: 'Expert Roster', icon: Users },
            { id: 'departments', label: 'Services', icon: Layers },
            { id: 'blogs', label: 'Insights & Blogs', icon: FileText },
            { id: 'messages', label: 'Inquiries', icon: Mail },
            { id: 'settings', label: 'Settings & SEO', icon: Settings }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeSubTab === item.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* Right Dynamic area */}
        <main className="flex-grow w-full space-y-6">

          {/* OVERVIEW PANEL */}
          {activeSubTab === 'overview' && analytics && (
            <div className="space-y-8">
              {/* Stat grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Gross Revenue', val: `$${analytics.summary.totalRevenue}`, icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
                  { label: 'Active Experts', val: analytics.summary.totalDoctors, icon: Users, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/20' },
                  { label: 'Total Bookings', val: analytics.summary.totalAppointments, icon: Calendar, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
                  { label: 'Services Offered', val: analytics.summary.totalDepartments, icon: Layers, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <div className={`p-2 rounded-xl ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-slate-950 dark:text-white mt-3">{stat.val}</p>
                  </div>
                ))}
              </div>

              {/* Graphical Trend & Ratios */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Bookings table overview */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Weekly Consulting Trend</h3>
                  {analytics.chartData.length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-slate-400 text-xs">No project engagement history recorded yet.</div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {analytics.chartData.map((d: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 text-xs">
                          <span className="w-24 font-bold text-slate-500">{d.date}</span>
                          <div className="flex-grow bg-slate-100 dark:bg-slate-800 h-5 rounded-lg overflow-hidden relative">
                            <div className="bg-indigo-500 h-full rounded-lg" style={{ width: `${Math.min(100, (d.appointments / 10) * 100)}%` }} />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-white w-12 text-right">{d.appointments} books</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Booking statuses breakdowns */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Booking Statuses</h3>
                  <div className="space-y-3.5">
                    {[
                      { label: 'Confirmed bookings', count: analytics.summary.confirmedApts, percentage: (analytics.summary.confirmedApts / (analytics.summary.totalAppointments || 1)) * 100, color: 'bg-emerald-500' },
                      { label: 'Pending validation', count: analytics.summary.pendingApts, percentage: (analytics.summary.pendingApts / (analytics.summary.totalAppointments || 1)) * 100, color: 'bg-amber-500' },
                      { label: 'Cancelled / Expired', count: analytics.summary.cancelledApts, percentage: (analytics.summary.cancelledApts / (analytics.summary.totalAppointments || 1)) * 100, color: 'bg-rose-500' }
                    ].map((st, i) => (
                      <div key={i} className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-slate-500">
                          <span className="font-semibold">{st.label}</span>
                          <span className="font-extrabold text-slate-800 dark:text-white">{st.count}</span>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${st.color}`} style={{ width: `${st.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* APPOINTMENTS MANAGEMENT */}
          {activeSubTab === 'appointments' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Scheduled Consultation Slots</h3>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-bold text-slate-500">{appointments.length} overall records</span>
              </div>

              {appointments.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">No agency appointments registered in database.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-widest text-[10px]">
                        <th className="py-3 px-4 font-bold">Client Details</th>
                        <th className="py-3 px-4 font-bold">Expert Specialist</th>
                        <th className="py-3 px-4 font-bold">Schedule</th>
                        <th className="py-3 px-4 font-bold">Project Brief</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                      {appointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-800 dark:text-white">{apt.patientName}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{apt.patientEmail}</p>
                            <p className="text-[10px] text-slate-400">{apt.patientPhone}</p>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                            {doctors.find(d => d.id === apt.doctorId)?.name || 'Lead Specialist'}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                            <p className="font-bold">{apt.date}</p>
                            <p className="text-[10px] text-teal-600 mt-0.5 font-bold">{apt.timeSlot}</p>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 max-w-[150px] truncate">{apt.notes || '-'}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              apt.status === 'confirmed' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50' :
                              apt.status === 'cancelled' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200/50' :
                              'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/50'
                            }`}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex gap-1.5 justify-end">
                              {apt.status === 'pending' && (
                                <button
                                  onClick={() => handleAptStatus(apt.id, 'confirmed')}
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white cursor-pointer transition-colors"
                                  title="Confirm Appointment"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              {apt.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleAptStatus(apt.id, 'cancelled')}
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white cursor-pointer transition-colors"
                                  title="Cancel Appointment"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteApt(apt.id)}
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-600 hover:text-white cursor-pointer transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* DOCTORS ROSTER */}
          {activeSubTab === 'doctors' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Agency Expert Profiles</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage professional bios, service groups, slot configurations, and rates.</p>
                </div>
                <button
                  onClick={() => setDocModal({ open: true })}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  <Plus className="w-4.5 h-4.5" />
                  Add Expert Profile
                </button>
              </div>

              {/* Roster list */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-widest text-[10px] pb-3">
                      <th className="py-3 px-4 font-bold">Expert Info</th>
                      <th className="py-3 px-4 font-bold">Service offering</th>
                      <th className="py-3 px-4 font-bold">Consultation Rate</th>
                      <th className="py-3 px-4 font-bold">Roster Schedule</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {doctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img src={doc.image} alt={doc.name} className="w-9 h-9 rounded-xl object-cover object-top shrink-0 border border-slate-100 dark:border-slate-800" />
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white">{doc.name}</p>
                            <p className="text-[10px] text-indigo-500 font-semibold">{doc.specialization}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">
                          {departments.find(d => d.id === doc.departmentId)?.name || 'Specialist'}
                        </td>
                        <td className="py-3 px-4 font-black text-slate-900 dark:text-white">${doc.fee}</td>
                        <td className="py-3 px-4 text-slate-500">
                          <p className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{doc.availableDays.join(', ')}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{doc.availableSlots.length} slots active</p>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => handleEditDoc(doc)}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoc(doc.id)}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-600 hover:text-white cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DEPARTMENTS PANEL */}
          {activeSubTab === 'departments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Agency Services Offered</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Maintain professional digital divisions, service catalogs, and team descriptions.</p>
                </div>
                <button
                  onClick={() => setDeptModal({ open: true })}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  <Plus className="w-4.5 h-4.5" />
                  Create Service Group
                </button>
              </div>

              {/* Grid of departments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-48">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">{dept.name}</span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-widest">{dept.iconName}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">{dept.description}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-800/80 pt-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mapped: {doctors.filter(d => d.departmentId === dept.id).length} Experts</span>
                      <button
                        onClick={() => handleDeleteDept(dept.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Service offering
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOGS MANAGEMENT */}
          {activeSubTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Agency Insights & Articles</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Author search engine strategies, dev tips, and industry insights.</p>
                </div>
                <button
                  onClick={() => setBlogModal({ open: true })}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  <Plus className="w-4.5 h-4.5" />
                  Publish Article
                </button>
              </div>

              {/* blogs list */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-widest text-[10px]">
                      <th className="py-3 px-4 font-bold">Article Details</th>
                      <th className="py-3 px-4 font-bold">Category</th>
                      <th className="py-3 px-4 font-bold">Author</th>
                      <th className="py-3 px-4 font-bold">Time Limit</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {blogs.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white max-w-[200px] truncate">
                          {b.title}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-teal-600">{b.category}</td>
                        <td className="py-3.5 px-4 text-slate-500">{b.author}</td>
                        <td className="py-3.5 px-4 text-slate-500">{b.readTime}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => handleEditBlog(b)}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(b.id)}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-600 hover:text-white cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CONTACT INQUIRIES */}
          {activeSubTab === 'messages' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-6">Client Inquiries & Messages</h3>
              
              {messages.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">No customer support messages registered.</div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl flex justify-between items-start">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">{m.name}</span>
                          <span className="text-[10px] text-slate-400">({m.email})</span>
                          <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            m.status === 'unread' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="font-bold text-xs text-slate-700 dark:text-slate-300">{m.subject}</p>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{m.message}</p>
                      </div>

                      <div className="flex gap-1.5">
                        {m.status === 'unread' && (
                          <button
                            onClick={() => handleMarkMessage(m.id, 'read')}
                            className="p-1.5 rounded-lg bg-teal-50 text-teal-600 text-xs font-bold hover:bg-teal-600 hover:text-white cursor-pointer transition-colors"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => alert(`Replying placeholder to: ${m.email}`)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors"
                        >
                          Reply Email
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CLINIC & SEO SETTINGS */}
          {activeSubTab === 'settings' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-50 dark:border-slate-800/80 pb-4 mb-6">Agency Info & Search Engine Optimization (SEO)</h3>
              
              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Agency Display Name</label>
                    <input
                      type="text"
                      value={settingsForm.clinicName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, clinicName: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Telephone</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Support Email</label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Physical Address</label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Working / Consulting Hours</label>
                  <input
                    type="text"
                    value={settingsForm.workingHours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="border-t border-slate-50 dark:border-slate-800/80 pt-5 mt-5 space-y-4">
                  <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Google Search Engine Optimization (SEO) Metadata</h4>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Search Result Title Tag</label>
                    <input
                      type="text"
                      value={settingsForm.seoTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, seoTitle: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Meta Description Tag</label>
                    <textarea
                      rows={3}
                      value={settingsForm.seoDescription}
                      onChange={(e) => setSettingsForm({ ...settingsForm, seoDescription: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-slate-800 dark:text-white focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/15 cursor-pointer"
                >
                  Save settings and sync SEO
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* DOCTOR CREATE/EDIT MODAL */}
      {docModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-2xl text-left overflow-y-auto max-h-[90vh]">
            <button onClick={() => setDocModal({ open: false })} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="w-5 h-5" /></button>
            <h4 className="font-bold text-sm text-indigo-500 uppercase tracking-widest border-b pb-3 mb-6">{docModal.editId ? 'Edit Expert Profile' : 'Add New Expert Specialist'}</h4>
            
            <form onSubmit={handleSaveDoc} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Expert Name</label>
                  <input type="text" value={docForm.name} onChange={(e) => setDocForm({ ...docForm, name: e.target.value })} required className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Specialization Title</label>
                  <input type="text" value={docForm.specialization} onChange={(e) => setDocForm({ ...docForm, specialization: e.target.value })} required className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Agency Division / Service Group</label>
                  <select value={docForm.departmentId} onChange={(e) => setDocForm({ ...docForm, departmentId: e.target.value })} required className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white">
                    <option value="">Select Division</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Experience (years)</label>
                  <input type="number" value={docForm.experience} onChange={(e) => setDocForm({ ...docForm, experience: Number(e.target.value) })} required className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Consultation Fee ($)</label>
                  <input type="number" value={docForm.fee} onChange={(e) => setDocForm({ ...docForm, fee: Number(e.target.value) })} required className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Profile Image URL</label>
                  <input type="text" placeholder="https://unsplash.com/..." value={docForm.image} onChange={(e) => setDocForm({ ...docForm, image: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Expert Biography</label>
                <textarea rows={2} value={docForm.bio} onChange={(e) => setDocForm({ ...docForm, bio: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Active Days (comma list)</label>
                  <input type="text" value={docForm.availableDays} onChange={(e) => setDocForm({ ...docForm, availableDays: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Time Slots (comma list)</label>
                  <input type="text" value={docForm.availableSlots} onChange={(e) => setDocForm({ ...docForm, availableSlots: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
                </div>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer">Save expert specialist record</button>
            </form>
          </div>
        </div>
      )}

      {/* DEPARTMENT MODAL */}
      {deptModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-2xl text-left">
            <button onClick={() => setDeptModal({ open: false })} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            <h4 className="font-bold text-sm text-indigo-500 uppercase tracking-widest border-b pb-3 mb-6">Create New Service Group</h4>
            
            <form onSubmit={handleSaveDept} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Service Group Name</label>
                <input type="text" placeholder="e.g. Pediatrics" value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} required className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Lucide Icon name</label>
                <input type="text" placeholder="Heart, Brain, Baby, Sparkles" value={deptForm.iconName} onChange={(e) => setDeptForm({ ...deptForm, iconName: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Division Description</label>
                <textarea rows={3} value={deptForm.description} onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })} required className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white resize-none" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer">Register Service Group</button>
            </form>
          </div>
        </div>
      )}

      {/* BLOG CREATE/EDIT MODAL */}
      {blogModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-2xl text-left overflow-y-auto max-h-[90vh]">
            <button onClick={() => setBlogModal({ open: false })} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            <h4 className="font-bold text-sm text-indigo-500 uppercase tracking-widest border-b pb-3 mb-6">{blogModal.editId ? 'Edit Article' : 'Publish New Article'}</h4>
            
            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Article Title</label>
                <input type="text" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} required className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                  <select value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white">
                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Author Name</label>
                  <input type="text" value={blogForm.author} onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Article Image URL</label>
                  <input type="text" value={blogForm.image} onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Read Time (minutes)</label>
                  <input type="text" value={blogForm.readTime} onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Short Excerpt Summary</label>
                <input type="text" value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Article Markdown Content</label>
                <textarea rows={5} value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} required className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white resize-none" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer">Publish now</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
