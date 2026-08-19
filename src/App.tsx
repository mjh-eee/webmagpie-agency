import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import {
  Heart, Brain, Baby, Activity, Sparkles, Smile, User, Mail, Phone, MapPin, Clock,
  ArrowRight, Check, X, ChevronRight, Calendar, DollarSign, Award, Star, Search, Filter,
  Download, LayoutDashboard, Trash2, Plus, MessageSquare, ChevronDown, ChevronUp, AlertCircle, FileText
} from 'lucide-react';
import { getWebsiteData, login, register, getUserAppointments, bookAppointment, cancelAppointment, submitContactMessage, subscribeNewsletter } from './localData';
import { Doctor, Department, Appointment, Blog, ContactMessage, User as UserType, ClinicSettings, FAQ, Testimonial, GalleryItem } from './types';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Hero from './components/Hero';
import DoctorCard from './components/DoctorCard';
import BlogCard from './components/BlogCard';
import AuthModal from './components/AuthModal';
import ReceiptDownload from './components/ReceiptDownload';
import AdminDashboard from './components/AdminDashboard';

// Helper to dynamically render Lucide Icons by string name
function renderLucideIcon(iconName: string, className = "w-5 h-5") {
  const IconComponent = (Icons as any)[iconName];
  if (!IconComponent) return <Activity className={className} />;
  return <IconComponent className={className} />;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Authenticated states
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Core Agency database states
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [settings, setSettings] = useState<ClinicSettings | null>(null);

  // Client Booking parameters
  const [bookingDoc, setBookingDoc] = useState<Doctor | null>(null);
  const [bookingForm, setBookingForm] = useState({
    date: '', timeSlot: '', notes: '', patientName: '', patientEmail: '', patientPhone: ''
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccessApt, setBookingSuccessApt] = useState<Appointment | null>(null);

  // Profile History state
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [receiptApt, setReceiptApt] = useState<Appointment | null>(null);

  // Generic contact message form
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Blog list filter/search
  const [blogSearch, setBlogSearch] = useState('');
  const [blogSelectedCategory, setBlogSelectedCategory] = useState('All');
  const [activeBlogDetail, setActiveBlogDetail] = useState<Blog | null>(null);

  // Team list filter/search
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorSelectedDept, setDoctorSelectedDept] = useState('All');

  // FAQ Expanded index state
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Gallery view filter
  const [galleryCategory, setGalleryCategory] = useState('All');

  // Pricing selected service division tab
  const [pricingServiceTab, setPricingServiceTab] = useState('dept_webdev');

  // Load User Session from localStorage on boot
  useEffect(() => {
    const storedToken = localStorage.getItem('agency_token');
    const storedUser = localStorage.getItem('agency_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    // Toggle Dark mode from user preference or system
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(systemDark);
  }, []);

  // Update HTML Dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load core website metadata and collections on boot
  useEffect(() => {
    fetchWebsiteData();
  }, []);

  // Fetch logged-in patient bookings when session changes
  useEffect(() => {
    if (token && user && user.role === 'patient') {
      fetchUserAppointments();
    }
  }, [token, user]);

  // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
  
  // const fetchWebsiteData = async () => {
  //   try {
  //     const [resDocs, resDepts, resBlogs, resTestimonials, resGallery, resFaqs, resSettings] = await Promise.all([
  //       fetch(`${API_BASE_URL}/api/doctors`),
  //       fetch(`${API_BASE_URL}/api/departments`),
  //       fetch(`${API_BASE_URL}/api/blogs`),
  //       fetch(`${API_BASE_URL}/api/testimonials`),
  //       fetch(`${API_BASE_URL}/api/gallery`),
  //       fetch(`${API_BASE_URL}/api/faqs`),
  //       fetch(`${API_BASE_URL}/api/settings`)
  //     ]);
  
  //     if (resDocs.ok) setDoctors(await resDocs.json());
  //     if (resDepts.ok) setDepartments(await resDepts.json());
  //     if (resBlogs.ok) setBlogs(await resBlogs.json());
  //     if (resTestimonials.ok) setTestimonials(await resTestimonials.json());
  //     if (resGallery.ok) setGallery(await resGallery.json());
  //     if (resFaqs.ok) setFaqs(await resFaqs.json());
  //     if (resSettings.ok) setSettings(await resSettings.json());
  //   } catch (e) {
  //     console.error('Error fetching agency collections:', e);
  //   }
  // };

const fetchWebsiteData = () => {
  const data = getWebsiteData();
  setDoctors(data.doctors);
  setDepartments(data.departments);
  setBlogs(data.blogs);
  setTestimonials(data.testimonials);
  setGallery(data.gallery);
  setFaqs(data.faqs);
  setSettings(data.settings);
};

  // const fetchUserAppointments = async () => {
  //   try {
  //     const res = await fetch('/api/appointments', {
  //       headers: { 'Authorization': `Bearer ${token}` }
  //     });
  //     if (res.ok) {
  //       setUserAppointments(await res.json());
  //     }
  //   } catch (e) {
  //     console.error('Error fetching bookings:', e);
  //   }
  // };

  const fetchUserAppointments = () => {
    if (!user) return;
    setUserAppointments(getUserAppointments(user.id, user.role === 'admin'));
  };

  const handleAuthSuccess = (newToken: string, authenticatedUser: UserType) => {
    setToken(newToken);
    setUser(authenticatedUser);
    localStorage.setItem('agency_token', newToken);
    localStorage.setItem('agency_user', JSON.stringify(authenticatedUser));
    setAuthModalOpen(false);

    // Sync pre-fill booking details with user credentials
    setBookingForm({
      ...bookingForm,
      patientName: authenticatedUser.name,
      patientEmail: authenticatedUser.email
    });
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('agency_token');
    localStorage.removeItem('agency_user');
    setActiveTab('home');
  };

  // Submit appointment booking
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    if (!token) {
      setAuthModalOpen(true);
      return;
    }
    if (!bookingDoc) {
      setBookingError('Please choose an expert specialist profile.');
      return;
    }
    if (!bookingForm.date || !bookingForm.timeSlot) {
      setBookingError('Please select a valid consultation slot.');
      return;
    }

    try {
      
      // const response = await fetch('/api/appointments', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     doctorId: bookingDoc.id,
      //     departmentId: bookingDoc.departmentId,
      //     date: bookingForm.date,
      //     timeSlot: bookingForm.timeSlot,
      //     notes: bookingForm.notes,
      //     patientName: bookingForm.patientName,
      //     patientEmail: bookingForm.patientEmail,
      //     patientPhone: bookingForm.patientPhone
      //   })
      // });

      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.error || 'Booking failed');
      // }

      // setBookingSuccessApt(data);
      // fetchUserAppointments();
      // setActiveTab('booking-success');

      const result = bookAppointment(user!.id, {
        doctorId: bookingDoc.id,
        departmentId: bookingDoc.departmentId,
        date: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
        notes: bookingForm.notes,
        patientName: bookingForm.patientName,
        patientEmail: bookingForm.patientEmail,
        patientPhone: bookingForm.patientPhone
      });
      if ('error' in result) {
        setBookingError(result.error);
        return;
      }
      setBookingSuccessApt(result.appointment);
      fetchUserAppointments();
      setActiveTab('booking-success');
    } 
    
    catch (err: any) {
      setBookingError(err.message || 'An error occurred during slot booking.');
    }
  };



  // Cancel Patient booking
  // const handleCancelBooking = async (aptId: string) => {
  //   if (!window.confirm('Cancel this consultation slot? This operation is irreversible.')) return;
  //   try {
  //     const res = await fetch(`/api/appointments/${aptId}/status`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify({ status: 'cancelled' })
  //     });
  //     if (res.ok) {
  //       fetchUserAppointments();
  //     }
  //   } catch (e) {
  //     console.error('Error cancelling appointment:', e);
  //   }
  // };
  const handleCancelBooking = (aptId: string) => {
    if (!window.confirm('Cancel this consultation slot? This operation is irreversible.')) return;
    if (cancelAppointment(aptId)) fetchUserAppointments();
  };

  // Submit generic contact message
  // const handleContactSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const res = await fetch('/api/contact', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(contactForm)
  //     });
  //     if (res.ok) {
  //       setContactSuccess(true);
  //       setContactForm({ name: '', email: '', subject: '', message: '' });
  //       setTimeout(() => setContactSuccess(false), 5000);
  //     }
  //   } catch (e) {
  //     console.error('Error delivering support query:', e);
  //   }
  // };
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactMessage(contactForm);
    setContactSuccess(true);
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setContactSuccess(false), 5000);
  };

  // Newsletter action proxy
  // const handleSubscribeNewsletter = async (email: string): Promise<boolean> => {
  //   try {
  //     const res = await fetch('/api/newsletter', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email })
  //     });
  //     if (res.ok) {
  //       const data = await res.json();
  //       if (settings) {
  //         setSettings({ ...settings, newsletterCount: data.count });
  //       }
  //       return true;
  //     }
  //     return false;
  //   } catch {
  //     return false;
  //   }
  // };
  const handleSubscribeNewsletter = async (email: string): Promise<boolean> => {
    const count = subscribeNewsletter();
    if (settings) setSettings({ ...settings, newsletterCount: count });
    return true;
  };

  // Initiate booking from Doctor Card
  const initiateBooking = (doctor: Doctor, initialNotes = '') => {
    setBookingDoc(doctor);
    setBookingForm({
      patientName: user ? user.name : '',
      patientEmail: user ? user.email : '',
      patientPhone: '',
      date: '',
      timeSlot: '',
      notes: initialNotes
    });
    setBookingSuccessApt(null);
    setBookingError('');
    setActiveTab('booking');
  };

  // Filters for Team
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) || doc.specialization.toLowerCase().includes(doctorSearch.toLowerCase());
    const matchesDept = doctorSelectedDept === 'All' || doc.departmentId === doctorSelectedDept;
    return matchesSearch && matchesDept;
  });

  // Filters for Blogs
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(blogSearch.toLowerCase()) || b.content.toLowerCase().includes(blogSearch.toLowerCase());
    const matchesDept = blogSelectedCategory === 'All' || b.category === blogSelectedCategory;
    return matchesSearch && matchesDept;
  });

  // Filters for Gallery
  const filteredGallery = galleryCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === galleryCategory);

  // Global settings fallbacks
  const currentSettings: ClinicSettings = settings || {
    clinicName: 'WebMagpie Digital Agency',
    email: 'contact@webmagpie.com',
    phone: '+1 (555) 789-1024',
    address: '742 Enterprise Boulevard, Creative District, San Francisco',
    workingHours: 'Mon - Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM',
    socialLinks: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' },
    seoTitle: 'WebMagpie Agency',
    seoDescription: 'Premium Web Development, SEO, and Digital Marketing Agency.',
    newsletterCount: 145
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-serif selection:bg-teal-500 selection:text-white transition-colors duration-300">
      
      {/* Dynamic Header */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        clinicName={currentSettings.clinicName}
      />

      {/* Primary Routing view area */}
      <div className="flex-grow">
        
        {/* VIEW: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-24 pb-24">
            <Hero
              onBookClick={() => {
                if (doctors.length > 0) initiateBooking(doctors[0]);
                else setActiveTab('doctors');
              }}
              clinicName={currentSettings.clinicName}
            />

            {/* Why Choose Us Feature section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto space-y-3.5">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Why WebMagpie</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">Our Core Digital Philosophy</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">We integrate modern software development, pioneering search marketing, and premium client automation to grow your business.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[
                  { title: 'Custom Web Development', desc: 'We design high-resolution interfaces, optimized codebases, and custom responsive web apps with pixel-perfect accuracy.', icon: Activity, color: 'text-rose-500' },
                  { title: 'Advanced SEO Strategies', desc: 'Our expert web optimizers craft data-driven SEO campaigns to elevate organic search placement, search ranking, and brand conversion.', icon: Brain, color: 'text-indigo-500' },
                  { title: 'Full-Suite Marketing', desc: 'From paid search (PPC) and paid social campaigns to comprehensive digital branding, we drive real client growth and high ROI.', icon: Heart, color: 'text-teal-500' }
                ].map((f, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm text-left space-y-4">
                    <div className={`w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center ${f.color}`}>
                      <f.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-950 dark:text-white">{f.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Departments Quick Showcase */}
            <section id="departments" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-12">
                <div className="text-left space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Services Hub</span>
                  <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white">Our Service Divisions</h2>
                </div>
                <button onClick={() => setActiveTab('departments')} className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5 hover:gap-2 transition-all cursor-pointer">
                  See All Divisions
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.slice(0, 3).map((dept) => (
                  <div key={dept.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-start gap-4 text-left hover:-translate-y-1 transition-transform">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                      {renderLucideIcon(dept.iconName, "w-6 h-6")}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-950 dark:text-white">{dept.name} Service</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{dept.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Specialists showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-12">
                <div className="text-left space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Our Experts</span>
                  <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white">Our Creative Team</h2>
                </div>
                <button onClick={() => setActiveTab('doctors')} className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5 hover:gap-2 transition-all cursor-pointer">
                  Meet All Experts
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.slice(0, 3).map((doc) => (
                  <DoctorCard
                    key={doc.id}
                    doctor={doc}
                    department={departments.find(d => d.id === doc.departmentId)}
                    onBook={initiateBooking}
                  />
                ))}
              </div>
            </section>

            {/* CTA banner section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-8 sm:p-12 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 text-left shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -z-10" />
                
                <div className="space-y-4 max-w-2xl">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Instant Project Booking</span>
                  <h3 className="text-2xl sm:text-3xl font-bold leading-tight">Ready to Launch Your Next Project?</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Choose your expert, select a date, secure your consultation slot, and receive your booking receipt in under two minutes.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (doctors.length > 0) initiateBooking(doctors[0]);
                    else setActiveTab('doctors');
                  }}
                  className="px-8 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm whitespace-nowrap shadow-lg shadow-teal-500/10 active:scale-95 transition-all cursor-pointer"
                >
                  Book Consultation Now
                </button>
              </div>
            </section>

            {/* Testimonials Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Client Stories</span>
                <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white">What Our Clients Say</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.slice(0, 3).map((item) => (
                  <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm text-left flex flex-col justify-between h-full space-y-4">
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">"{item.feedback}"</p>
                    <div className="flex items-center gap-3 border-t border-slate-50 dark:border-slate-800/80 pt-4">
                      <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100" />
                      <div>
                        <p className="font-bold text-xs text-slate-950 dark:text-white">{item.name}</p>
                        <p className="text-[10px] text-teal-600 font-semibold">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW: ABOUT */}
        {activeTab === 'about' && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Our Agency</span>
              <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">Pioneering Result-Driven Web Solutions</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                WebMagpie Digital Agency is a state-of-the-art software and digital marketing partner. We believe that robust code, search engine superiority, and client transparency represent the ultimate pillars of business scaling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="aspect-video rounded-3xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600" alt="Agency Creative Office" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">Our Specialized Agency Mission</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We are focused on high-performance organic SEO campaigns, bespoke web application architectures, and end-to-end paid search consulting. Our mission is to scale user metrics, generate substantial click CTRs, and protect search performance indexes.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-2xl font-black text-teal-600">12+</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Experts</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-2xl font-black text-teal-600">450+</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Projects</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-2xl font-black text-teal-600">99%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: HOW WE HELP */}
        {activeTab === 'how-we-help' && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Our Blueprint</span>
              <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">How We Help Your Business Scale</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                We replace chaotic, uncoordinated agency tactics with a standardized, hyper-disciplined strategy execution framework. Here is how we build, optimize, and scale your digital assets.
              </p>
            </div>

            {/* 4-Step Interactive Process Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Technical Discovery",
                  desc: "We perform comprehensive code audits, search pattern analyses, and UX research to mapping exact bottlenecks.",
                  icon: "Search"
                },
                {
                  step: "02",
                  title: "Aesthetic Blueprinting",
                  desc: "Our design experts engineer clean typographic hierarchies and user interfaces with intentional negative space.",
                  icon: "Layers"
                },
                {
                  step: "03",
                  title: "Full-Stack Development",
                  desc: "We write robust, lightweight React and TypeScript code optimized for rapid rendering speeds and security.",
                  icon: "Terminal"
                },
                {
                  step: "04",
                  title: "Performance Optimizations",
                  desc: "We deploy GA4 tracking, integrate semantic search schemas, and fine-tune Core Web Vitals to maximize search placement.",
                  icon: "TrendingUp"
                }
              ].map((item, idx) => {
                return (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:-translate-y-1 transition-all duration-300 relative">
                    <span className="absolute top-6 right-6 text-2xl font-black text-slate-100 dark:text-slate-850">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
                      {renderLucideIcon(item.icon, "w-5 h-5")}
                    </div>
                    <h3 className="font-bold text-base text-slate-950 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Technical Services Delivery Matrix */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Strict Quality Standards</span>
                <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Our Service Delivery Architecture</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">SEO Schema Injection</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Every landing copy and dynamic web app page we ship contains correct semantic schemas, structured data, and meta keywords mapping to ensure search crawlers catalog your services flawlessly.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Responsive Display Rhythms</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        We design desktop-first precision models and mobile-first responsive stylesheets to prevent layout reflows, ensuring zero font shifts and high-fidelity display across resolutions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Real-Time Data Pipelines</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        We link database structures directly with reliable cloud servers and client web consoles, enabling dynamic stats logging and secure payment systems without latency bottlenecks.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Robust State Architectures</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Using modern React state hook matrices, we verify and prevent infinite re-renders. Every action logs client feedback instantly with smooth transition timelines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-xs text-slate-400 font-semibold">Have a custom project requirement? Book a lead expert to discuss scope.</p>
                <button
                  onClick={() => {
                    if (doctors.length > 0) initiateBooking(doctors[0]);
                    else setActiveTab('doctors');
                  }}
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-teal-600/10 active:scale-98"
                >
                  Book a Strategy Call
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: WHO WE HELP */}
        {activeTab === 'who-we-help' && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Target Audiences</span>
              <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">Engineered for Ambitious Creators</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                We design and optimize campaigns for companies that demand measurable search authority, premium typographic designs, and robust code. Here are the core industries we help dominate.
              </p>
            </div>

            {/* Core Sectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "SaaS & Tech Startups",
                  desc: "For rapid-growth technology teams needing high-performance dashboards, secure API integrations, and conversion-optimized marketing pages.",
                  list: ["Framer Motion visual animations", "Stripe payment pipeline setup", "TypeScript client state engines"],
                  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
                  icon: "Cpu"
                },
                {
                  title: "E-Commerce & Retail Brands",
                  desc: "For digital brands requiring responsive web catalog flows, rapid checkout optimizations, inventory syncing, and high performance landing assets.",
                  list: ["Catalog speed performance checks", "Multi-network retargeting pixels", "Custom checkout friction removal"],
                  image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400",
                  icon: "Award"
                },
                {
                  title: "Professional Service Providers",
                  desc: "For established dental, medical, and agency operations seeking structured lead reservation systems, search prominence, and organic local authority.",
                  list: ["Bespoke online slot schedulers", "Localized map optimization", "Conversion attribution logs"],
                  image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400",
                  icon: "Users"
                }
              ].map((sector, idx) => {
                return (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                    <div>
                      <div className="aspect-video relative overflow-hidden">
                        <img src={sector.image} alt={sector.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                          {renderLucideIcon(sector.icon, "w-4 h-4")}
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">{sector.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{sector.desc}</p>
                        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                          {sector.list.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <button
                        onClick={() => {
                          if (doctors.length > 0) initiateBooking(doctors[0]);
                          else setActiveTab('doctors');
                        }}
                        className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer transition-colors"
                      >
                        Explore Custom {sector.title.split(" ")[0]} Scope
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Impact Metric section */}
            <div className="p-8 sm:p-12 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 text-left shadow-2xl">
              <div className="absolute top-0 left-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl -z-10" />
              <div className="space-y-4 max-w-xl">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Enterprise Scaling</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">Need Enterprise Service Levels?</h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  We handle high-scale PostgreSQL analytics warehouses, multiple regional domains migrations, custom API pipelines, and high-frequency blog authorship pipelines.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <button
                  onClick={() => setActiveTab('pricing')}
                  className="px-6 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs whitespace-nowrap active:scale-95 transition-all cursor-pointer text-center"
                >
                  View Agency Pricing Packages
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="px-6 py-4 rounded-2xl border border-slate-700 hover:border-slate-500 text-white font-extrabold text-xs whitespace-nowrap active:scale-95 transition-all cursor-pointer text-center"
                >
                  Contact Partner Desk
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: WHY WEBMAGPIE */}
        {activeTab === 'why-webmagpie' && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">The Agency Advantage</span>
              <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">Why Partners Choose WebMagpie</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                We believe that web design and digital search campaigns are critical engineering systems. Here is why ambitious brands replace standard agencies with our high-contrast code studio.
              </p>
            </div>

            {/* Core Value Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Performance Code over Slop",
                  desc: "Zero bloated drag-and-drop builders. We write crisp, clean React, Tailwind, and Node architectures that achieve maximum speed ranking benchmarks instantly.",
                  icon: "Terminal"
                },
                {
                  title: "Calculated Design Rhythm",
                  desc: "We prioritize balanced margins, perfect baseline alignments, elegant Display typography, and spacious layouts that capture consumer authority within milliseconds.",
                  icon: "Layers"
                },
                {
                  title: "Scientific SEO schema",
                  desc: "We analyze competitive gap statistics, map search engine indexes, inject automated structured JSON-LD schemas, and construct high CTR content streams.",
                  icon: "Search"
                }
              ].map((pillar, idx) => {
                return (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      {renderLucideIcon(pillar.icon, "w-5 h-5")}
                    </div>
                    <h3 className="font-extrabold text-base text-slate-950 dark:text-white">{pillar.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Comparative Analysis Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Honest Evaluation</span>
                <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">How We Compare</h2>
                <p className="text-xs text-slate-400">Comparing standard agency pipelines to WebMagpie specialized code systems.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider">
                      <th className="pb-4 pr-4">Critical Metric</th>
                      <th className="pb-4 px-4 text-slate-400">Typical Marketing Agency</th>
                      <th className="pb-4 pl-4 text-teal-600 dark:text-teal-400">WebMagpie Specialized Studio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                    {[
                      {
                        metric: "Code Foundation",
                        typical: "Slow, bloated WordPress page builders with excessive plugins.",
                        magpie: "Bespoke React + Tailwind CSS codebases built from scratch."
                      },
                      {
                        metric: "Page Speed & Web Vitals",
                        typical: "Low mobile scores, high Cumulative Layout Shifts (CLS).",
                        magpie: "Guaranteed high speed benchmarks and responsive designs."
                      },
                      {
                        metric: "SEO Integration",
                        typical: "Basic meta tag plugins without schema architecture.",
                        magpie: "Semantic HTML headers, automatic JSON-LD, custom keyword mapping."
                      },
                      {
                        metric: "Communication Flow",
                        typical: "Client-facing accounts managers layer, delay responses.",
                        magpie: "Direct booking slot pipeline, clear email receipt code tracking."
                      },
                      {
                        metric: "Contract Transparency",
                        typical: "Opaque retainer commitments, hidden setup invoices.",
                        magpie: "Bespoke basic, premium, and advanced packages detailed up-front."
                      }
                    ].map((row, i) => (
                      <tr key={i} className="text-slate-600 dark:text-slate-300">
                        <td className="py-4 pr-4 font-extrabold text-slate-850 dark:text-slate-100">{row.metric}</td>
                        <td className="py-4 px-4">{row.typical}</td>
                        <td className="py-4 pl-4 font-bold text-slate-950 dark:text-white bg-teal-500/5 rounded-xl">{row.magpie}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setActiveTab('contact')}
                  className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-teal-600/10"
                >
                  Initiate Secure Onboarding Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SERVICES */}
        {activeTab === 'services' && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Expert Services</span>
              <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">High-Performance Digital Solutions</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                WebMagpie delivers advanced, specialized developer strategies and growth optimization packages across core corporate divisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Custom Web Development', price: '$2,500+', desc: 'Bespoke React/Next.js dynamic platforms, lightning-fast rendering speed, API routing, and serverless architectures.', icon: Activity },
                { title: 'Advanced SEO Campaigns', price: '$1,200+', desc: 'Complete content audits, localized search term indexing, schema structures, meta tags optimization, and rank tracking.', icon: Heart },
                { title: 'Full-Stack SaaS Building', desc: 'Secure customer dashboards, database integrations, Stripe billing pipelines, and custom state managers.', price: '$4,500+', icon: Brain },
                { title: 'Paid Social & PPC Advertising', price: '$850+', desc: 'Targeted visual ads setups, Google Search Console bid adjustments, pixel conversion logs, and precise ROI tracking.', icon: Sparkles },
                { title: 'E-Commerce Solutions', price: '$3,200+', desc: 'Custom storefront designs, multi-vendor carts, product search filters, catalog syncing, and high performance checkouts.', icon: Baby },
                { title: 'UI/UX Interactive Audit', price: '$600+', desc: 'Rigorous accessibility verification, modern Display typography pairings, custom animations, and layout rhythm reviews.', icon: Smile }
              ].map((serv, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between h-56 hover:-translate-y-1 transition-transform">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                        <serv.icon className="w-5 h-5" />
                      </div>
                      <span className="font-extrabold text-lg text-slate-950 dark:text-white">{serv.price}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-950 dark:text-white">{serv.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{serv.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Agency Divisions</span>
              <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">Our Service Offerings</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                We operate specialized technical departments designed for high performance client deliverables. Explore our centers below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept) => (
                <div key={dept.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    {renderLucideIcon(dept.iconName, "w-6 h-6")}
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">{dept.name} Division</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{dept.description}</p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>• Mapped: {doctors.filter(d => d.departmentId === dept.id).length} Active Lead Experts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: DOCTORS / TEAM */}
        {activeTab === 'doctors' && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="max-w-xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Agency Team</span>
                <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">Our Digital Experts</h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Meet our industry experienced creators, developers, SEO masters, and strategy leads.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search doctor or title..."
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-full md:w-60 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
                  />
                </div>

                <select
                  value={doctorSelectedDept}
                  onChange={(e) => setDoctorSelectedDept(e.target.value)}
                  className="px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Divisions</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Doctors Grid */}
            {filteredDoctors.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-xs">No doctors found matching filters.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDoctors.map((doc) => (
                  <DoctorCard
                    key={doc.id}
                    doctor={doc}
                    department={departments.find(d => d.id === doc.departmentId)}
                    onBook={initiateBooking}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: APPOINTMENT BOOKING */}
        {activeTab === 'booking' && bookingDoc && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Booking Pipeline</span>
              <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">Schedule Project Consultation</h1>
              <p className="text-sm text-slate-500">Please provide your valid contact details to request an immediate creative agency reservation.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Form */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                
                {bookingError && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <form onSubmit={handleBookAppointment} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">Client Full Name</label>
                      <input
                        type="text"
                        value={bookingForm.patientName}
                        onChange={(e) => setBookingForm({ ...bookingForm, patientName: e.target.value })}
                        required
                        className="w-full px-4 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">Client Email</label>
                      <input
                        type="email"
                        value={bookingForm.patientEmail}
                        onChange={(e) => setBookingForm({ ...bookingForm, patientEmail: e.target.value })}
                        required
                        className="w-full px-4 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">Client Contact Phone</label>
                      <input
                        type="text"
                        placeholder="e.g. +1 (555) 000-0000"
                        value={bookingForm.patientPhone}
                        onChange={(e) => setBookingForm({ ...bookingForm, patientPhone: e.target.value })}
                        required
                        className="w-full px-4 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">Consultation Date</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        required
                        className="w-full px-4 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Time slot picker */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">Available Time Slots</label>
                    <div className="grid grid-cols-3 gap-2">
                      {bookingDoc.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingForm({ ...bookingForm, timeSlot: slot })}
                          className={`py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            bookingForm.timeSlot === slot
                              ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/15'
                              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">Project Scope / Special Requirements (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Outline target specifications, search platform needs, or developer scope requirements..."
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      className="w-full px-4 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md shadow-teal-600/15 active:scale-95 transition-all cursor-pointer"
                  >
                    {!token ? 'Authenticate to Book Consultation' : 'Confirm & Book Consultation'}
                  </button>
                </form>

              </div>

              {/* Right doctor Card */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex gap-4 items-center border-b border-slate-100 dark:border-slate-800 pb-5">
                  <img src={bookingDoc.image} alt={bookingDoc.name} className="w-16 h-16 rounded-2xl object-cover object-top border shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-950 dark:text-white">{bookingDoc.name}</h3>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">{bookingDoc.specialization}</p>
                    <span className="inline-block text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded-full mt-1.5">
                      {departments.find(d => d.id === bookingDoc.departmentId)?.name || 'Division'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Professional Experience</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{bookingDoc.experience} Years</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Client Rating</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {bookingDoc.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Consultation Fee</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-base">${bookingDoc.fee}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100/50 text-[11px] leading-relaxed text-teal-800 dark:text-teal-400">
                  <p className="font-bold">Agency Policy Notice:</p>
                  <p className="mt-0.5">Please review date and timeslots carefully. Consultation fees are logged securely during checkout or compiled upon final design delivery agreements.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: BOOKING SUCCESS */}
        {activeTab === 'booking-success' && bookingSuccessApt && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">Consultation Reserved!</h1>
              <p className="text-sm text-slate-500">
                Your agency appointment has been securely registered. Download your digital receipt below to track your booking code.
              </p>
            </div>

            <ReceiptDownload
              appointment={bookingSuccessApt}
              doctor={doctors.find(d => d.id === bookingSuccessApt.doctorId)}
              department={departments.find(d => d.id === bookingSuccessApt.departmentId)}
              clinicName={currentSettings.clinicName}
            />

            <button
              onClick={() => setActiveTab('profile')}
              className="text-xs font-bold text-teal-600 hover:underline cursor-pointer block mx-auto"
            >
              View appointment history →
            </button>
          </div>
        )}

        {/* VIEW: BLOG */}
        {activeTab === 'blog' && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
              <div className="max-w-xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Agency Roster</span>
                <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">Our Digital Journals</h1>
                <p className="text-sm text-slate-500">Read guidelines on search marketing algorithms, React speed optimization, and dynamic branding.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={blogSearch}
                    onChange={(e) => setBlogSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-full md:w-60 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
                  />
                </div>

                <select
                  value={blogSelectedCategory}
                  onChange={(e) => setBlogSelectedCategory(e.target.value)}
                  className="px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Neurology">Neurology</option>
                </select>
              </div>
            </div>

            {/* Blogs list */}
            {filteredBlogs.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-xs">No articles matching parameters.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((b) => (
                  <BlogCard
                    key={b.id}
                    blog={b}
                    onRead={setActiveBlogDetail}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
              <div className="max-w-xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Visual Tour</span>
                <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">Our Hospital Gallery</h1>
                <p className="text-sm text-slate-500">Explore our clean, state-of-the-art diagnostic imaging lobbies and consulting suites.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {['All', 'Clinic', 'Departments', 'Equipment', 'Team'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      galleryCategory === cat
                        ? 'bg-teal-600 text-white'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((item) => (
                <div key={item.id} className="relative aspect-video rounded-3xl overflow-hidden group shadow-sm border border-slate-100 dark:border-slate-800">
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent text-white p-6 flex flex-col justify-end text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">{item.category}</span>
                    <h4 className="font-extrabold text-sm mt-1">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Verification</span>
              <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">Patient Recovery Records</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Read direct diagnostics logs and reviews of outpatient care compiled across our cardiology, pediatrics, and cosmetic smile procedures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-1">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">"{item.feedback}"</p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-slate-50 dark:border-slate-800/80 pt-4">
                    <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100" />
                    <div>
                      <p className="font-bold text-xs text-slate-950 dark:text-white">{item.name}</p>
                      <p className="text-[10px] text-teal-600 font-semibold">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: PRICING */}
        {activeTab === 'pricing' && (() => {
          const servicePackages: Record<string, {
            name: string;
            description: string;
            price: string;
            type: string;
            isPopular?: boolean;
            features: string[];
          }[]> = {
            dept_webdev: [
              {
                name: 'Basic Package',
                description: 'Ideal for startups needing a fast, professional, and fully responsive web presence.',
                price: '$1,499',
                type: 'One-Time',
                features: [
                  '3-Page Premium Responsive Design',
                  'Built with Modern React & Tailwind CSS',
                  'Secure Standard Contact Form Setup',
                  'Core Mobile & Load Speed Optimization',
                  '30 Days Post-Launch Maintenance Support'
                ]
              },
              {
                name: 'Premium Package',
                description: 'Perfect for growing brands requiring custom CMS controls, integrations, and animations.',
                price: '$3,499',
                type: 'One-Time',
                isPopular: true,
                features: [
                  'Up to 10 Pages Bespoke Web App',
                  'Complete Content Management (CMS) Setup',
                  'Advanced API & Database Integrations',
                  'Custom Framer Motion Page Animations',
                  'Strict Core Web Vitals Optimization',
                  '90 Days Priority Developer SLA Support'
                ]
              },
              {
                name: 'Advanced Package',
                description: 'Enterprise full-stack platforms with custom databases, subscriptions, and security.',
                price: '$5,999',
                type: 'One-Time',
                features: [
                  'Custom Full-Stack SaaS Architecture',
                  'Dynamic PostgreSQL/NoSQL Integrations',
                  'Stripe & PayPal Secure Billing Pipeline',
                  'Live Client Analytics & Chart Dashboards',
                  'Role-Based Multi-User Configurations',
                  '180 Days Dedicated Developer Support'
                ]
              }
            ],
            dept_seo: [
              {
                name: 'Basic Package',
                description: 'Perfect for local businesses targeting regional search placements and local map maps.',
                price: '$799',
                type: 'Monthly',
                features: [
                  'Local SEO & Map Pack Optimization',
                  'Up to 15 Specialized Target Keywords',
                  'Pristine Meta & Header Tags Rewrites',
                  'Monthly Analytics Performance Reports',
                  'Google Search Console Integration'
                ]
              },
              {
                name: 'Premium Package',
                description: 'Engineered for national visibility, intensive keyword mapping, and backlink velocity.',
                price: '$1,499',
                type: 'Monthly',
                isPopular: true,
                features: [
                  'Deep Technical Site Crawl Audits',
                  'Up to 50 High-Volume Target Keywords',
                  'Bi-Weekly High-Authority Guest Post Links',
                  'Internal Linking Structural Engineering',
                  'Thorough Competitor Keyword Gap Analysis',
                  'Monthly Executive Video Strategy Briefings'
                ]
              },
              {
                name: 'Advanced Package',
                description: 'Aggressive industry domination search campaigns designed to maximize global reach.',
                price: '$2,899',
                type: 'Monthly',
                features: [
                  'Enterprise Global Search Footprint Strategy',
                  'Unlimited Targeted Keywords Indexing',
                  'Custom Semantic Schema Markup Injection',
                  'Weekly Search Placement Rank Audits',
                  'Dynamic Content Creation Calendar',
                  'Dedicated Senior SEO Strategist Consultant'
                ]
              }
            ],
            dept_marketing: [
              {
                name: 'Basic Package',
                description: 'Ideal for launching your first paid acquisition campaign on a single social network.',
                price: '$499',
                type: 'Monthly',
                features: [
                  '1 Social Ad Platform Setup (Google or Meta)',
                  '3 Custom Ad Graphic Visuals Designed',
                  'Persuasive Conversational Hook Ad Copy',
                  'Basic Ad Account Pixel Installation',
                  'Monthly Ad Conversion Analytics Reporting'
                ]
              },
              {
                name: 'Premium Package',
                description: 'For active brands looking to minimize cost per lead and scale daily transaction volume.',
                price: '$999',
                type: 'Monthly',
                isPopular: true,
                features: [
                  'Cross-Platform Google Search & Meta Campaigns',
                  '8 Custom High-CTR Graphic & Video Ad Assets',
                  'Continuous Audience A/B Split Testing',
                  'Advanced Conversion Pixel Setup & Auditing',
                  'Comprehensive Multi-Stage Funnel Design',
                  'Weekly Budget Reallocation & Optimizations'
                ]
              },
              {
                name: 'Advanced Package',
                description: 'Enterprise omnichannel digital advertising across networks with CRM data integrations.',
                price: '$1,999',
                type: 'Monthly',
                features: [
                  'Omnichannel Ad Placement & Retargeting',
                  'Unlimited Custom High-Conversion Creatives',
                  'Algorithmic & AI-Driven Bid Optimizations',
                  'Continuous Custom Landing Page Split Tests',
                  'Full HubSpot or Salesforce API Setup',
                  'Bi-Weekly Strategy Board Advisory Meetings'
                ]
              }
            ],
            dept_design: [
              {
                name: 'Basic Package',
                description: 'Quick interactive blueprints and essential color palette templates to start.',
                price: '$899',
                type: 'One-Time',
                features: [
                  'Up to 3 Main Screen Key Wireframes',
                  'Custom Logo Design (3 Core Concepts)',
                  'Aesthetic Color Palette & Typography Guidelines',
                  'Essential Responsive Component Style Sheet'
                ]
              },
              {
                name: 'Premium Package',
                description: 'Our flagship service. Full high-fidelity prototypes ready for developer handoff.',
                price: '$1,899',
                type: 'One-Time',
                isPopular: true,
                features: [
                  'Up to 10 High-Fidelity Desktop & Mobile Screens',
                  'Fully Interactive Clickable Figma Prototype',
                  'Complete Brand Vector Identity & Assets Kit',
                  'Strict Accessibility (WCAG 2.1) Color Checks',
                  'Detailed Custom Interaction & Transition Spec'
                ]
              },
              {
                name: 'Advanced Package',
                description: 'Complete brand overhaul, interactive states, design tokens, and usability mapping.',
                price: '$3,499',
                type: 'One-Time',
                features: [
                  'Complete Custom Corporate Brand Overhaul',
                  'Unlimited Screen Interfaces & Interactive States',
                  'Real-User Remote Usability Testing Sessions',
                  'Dynamic Custom SVG Animated Graphics',
                  'Exportable Clean CSS Design Tokens Code',
                  'Pre-and-Post Development Design Code Quality SLA'
                ]
              }
            ],
            dept_analytics: [
              {
                name: 'Basic Package',
                description: 'A stable foundation for measuring essential customer actions on your web platform.',
                price: '$399',
                type: 'One-Time',
                features: [
                  'Clean Google Analytics 4 Instance Setup',
                  'Standard Scroll, Click, and Form Submit Tracking',
                  '1 Custom Interactive Looker Studio Board',
                  'Google Tag Manager Container Integration'
                ]
              },
              {
                name: 'Premium Package',
                description: 'Deep funnel analytics, custom attribution pathways, and e-commerce cart tracking.',
                price: '$899',
                type: 'One-Time',
                isPopular: true,
                features: [
                  'Bespoke User Path Funnel Tracking & Logs',
                  'Multi-Channel Attribution Path Mapping',
                  'Rich Real-Time Conversion Dashboards',
                  'Full E-Commerce Cart Tracking Integrations',
                  'Google Ads & Meta Pixel Tag Conversions Setup',
                  '3-Hour Dedicated Video Analyst Consultation'
                ]
              },
              {
                name: 'Advanced Package',
                description: 'Enterprise cross-domain data lakes, BigQuery setup, and custom alerts framework.',
                price: '$1,699',
                type: 'One-Time',
                features: [
                  'Enterprise Cross-Domain Analytics Architecture',
                  'BigQuery Cloud Data Warehouse Pipeline Integration',
                  'Heatmaps, Click Maps & User Recording Systems',
                  'Advanced Predictive Conversion Scoring Logic',
                  'Custom Slack/Email Real-Time Analytics Alerts',
                  '30 Days Dedicated Analyst Support Retainer'
                ]
              }
            ],
            dept_copywriting: [
              {
                name: 'Basic Package',
                description: 'Starters retainer to maintain active blog post visibility and baseline indexing.',
                price: '$599',
                type: 'Monthly',
                features: [
                  '4 SEO-Optimized Niche Articles (1,200 words each)',
                  'Basic Keyword Search Intent Target Mapping',
                  'Clean, Custom Styled Blog Post Cover Graphics',
                  'Social Media Copy Snippets for Multi-Sharing'
                ]
              },
              {
                name: 'Premium Package',
                description: 'Our most popular writing package. Expert articles, competitor gap analyses, and schema setup.',
                price: '$1,199',
                type: 'Monthly',
                isPopular: true,
                features: [
                  '10 Authoritative Industry Research Articles',
                  'Direct Expert Interviews for Rich Content',
                  'Full Strategic Monthly Content Calendar Setup',
                  'Advanced Content Schema Markup Instructions',
                  'Thorough Competitor Content Strategy Gaps Audit',
                  '2 Premium Newsletter Campaigns Crafted'
                ]
              },
              {
                name: 'Advanced Package',
                description: 'Bespoke thought leadership guest posts, custom lead magnet guides, and high-CTR landing copies.',
                price: '$2,299',
                type: 'Monthly',
                features: [
                  'Comprehensive Content Strategy & Lead Gen Retainer',
                  '20 High-Converting Articles or Case Studies',
                  '2 Professional Persuasion Landing Pages Authored',
                  'Complete Corporate Brand Storytelling Guidelines',
                  'Ghostwritten Executive Thought Leadership Articles',
                  'Custom E-Book / PDF Lead Magnet Blueprint'
                ]
              }
            ]
          };

          const expertMap: Record<string, string> = {
            dept_webdev: 'doc_sarah',
            dept_seo: 'doc_alan',
            dept_marketing: 'doc_ellie',
            dept_design: 'doc_ian',
            dept_analytics: 'doc_john',
            dept_copywriting: 'doc_henry'
          };

          const activePackages = servicePackages[pricingServiceTab] || servicePackages['dept_webdev'];

          const handleSelectPlan = (deptId: string, planName: string, planPrice: string) => {
            const targetDocId = expertMap[deptId] || (doctors.length > 0 ? doctors[0].id : null);
            const expert = doctors.find(d => d.id === targetDocId) || (doctors.length > 0 ? doctors[0] : null);
            const deptName = departments.find(d => d.id === deptId)?.name || 'selected service';
            const notesText = `Interested in the "${planName}" (${planPrice}) for our "${deptName}" project. Let's discuss scope!`;

            if (expert) {
              initiateBooking(expert, notesText);
            } else {
              setActiveTab('doctors');
            }
          };

          return (
            <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Premium Pricing Packages</span>
                <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">Results-Driven Agency Plans</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Transparent, value-focused service levels tailored to scale your brand. Toggle our core service divisions below to view target specifications.
                </p>
              </div>

              {/* Service tabs selection list */}
              <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-100 dark:border-slate-800">
                {(departments.length > 0 ? departments : [
                  { id: 'dept_webdev', name: 'Web Development' },
                  { id: 'dept_seo', name: 'Search Engine Optimization' },
                  { id: 'dept_marketing', name: 'Digital Marketing & PPC' },
                  { id: 'dept_design', name: 'UI/UX & Branding' },
                  { id: 'dept_analytics', name: 'Analytics & GA4' },
                  { id: 'dept_copywriting', name: 'Content Strategy' }
                ]).map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setPricingServiceTab(dept.id)}
                    className={`px-5 py-3 rounded-2xl text-xs font-bold cursor-pointer transition-all duration-200 ${
                      pricingServiceTab === dept.id
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/15 scale-102'
                        : 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    {dept.name}
                  </button>
                ))}
              </div>

              {/* Package cards list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {activePackages.map((plan, idx) => (
                  <div
                    key={idx}
                    className={`bg-white dark:bg-slate-900 border rounded-3xl p-8 shadow-sm flex flex-col justify-between h-full space-y-8 relative transition-all duration-300 hover:-translate-y-1 ${
                      plan.isPopular
                        ? 'border-teal-500/80 ring-2 ring-teal-500/10 dark:ring-teal-500/20 shadow-teal-500/5'
                        : 'border-slate-100 dark:border-slate-800/80'
                    }`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-teal-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md shadow-teal-600/20">
                        Most Popular Plan
                      </span>
                    )}

                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">{plan.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{plan.description}</p>
                      </div>

                      <div className="flex items-baseline gap-1.5 pt-2">
                        <span className="text-4xl font-black text-slate-950 dark:text-white tracking-tight">{plan.price}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">/ {plan.type}</span>
                      </div>

                      <ul className="space-y-3.5 pt-4 border-t border-slate-50 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(pricingServiceTab, plan.name, plan.price)}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                        plan.isPopular
                          ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/15'
                          : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      Book {plan.name} Consultation
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* VIEW: FAQs */}
        {activeTab === 'faq' && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Information Hub</span>
              <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">Help & Consultation FAQ</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Read categorical questions regarding booking pipelines, data privacy protocols, and diagnostic audits.
              </p>
            </div>

            <div className="max-w-3xl space-y-3">
              {faqs.map((f) => (
                <div key={f.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setExpandedFaqId(expandedFaqId === f.id ? null : f.id)}
                    className="w-full px-6 py-4.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex justify-between items-center hover:bg-slate-50 cursor-pointer"
                  >
                    <span>{f.question}</span>
                    {expandedFaqId === f.id ? <ChevronUp className="w-4.5 h-4.5 text-teal-600" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400" />}
                  </button>
                  {expandedFaqId === f.id && (
                    <div className="px-6 pb-5 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800/80">
                      {f.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: CONTACT */}
        {activeTab === 'contact' && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Contact Channels</span>
              <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">Get in Touch</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Reach out to our customer diagnostic support department with any procedural or scheduling questions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Form card */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6">
                
                {contactSuccess && (
                  <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-100 text-xs font-semibold text-teal-700 dark:text-teal-400">
                    Your query has been securely dispatched. An administrator will reply shortly.
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Your Name</label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Subject</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Message</label>
                    <textarea
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-950 dark:text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Send Secure Query
                  </button>
                </form>

              </div>

              {/* Coordinates Info */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
                <h3 className="font-bold text-base text-slate-950 dark:text-white">Physical Locations</h3>
                
                <ul className="space-y-4 text-xs text-slate-500">
                  <li className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{currentSettings.address}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="w-4.5 h-4.5 text-teal-600 shrink-0" />
                    <span>{currentSettings.phone}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="w-4.5 h-4.5 text-teal-600 shrink-0" />
                    <span className="break-all">{currentSettings.email}</span>
                  </li>
                  <li className="flex items-start gap-2.5 border-t border-slate-50 dark:border-slate-800/80 pt-4">
                    <Clock className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">Creative Studio Hours:</p>
                      <p className="text-[10px] mt-0.5">{currentSettings.workingHours}</p>
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6 leading-relaxed">
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">Privacy Policy & Client Data Security</h1>
            <p className="text-xs text-slate-400 font-semibold">Effective Date: July 21, 2026</p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              At WebMagpie Digital Agency, client campaign confidentiality is our absolute highest priority. We process digital credentials, search marketing plans, and campaign analytics logs in strict compliance with industry data security standards.
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Information Collection Protocols</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              We collect full names, electronic mail vectors, contact telephones, and optional custom project notes solely to securely route, map, and complete your booked creative consultations with seasoned specialists.
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Secure Cryptographic Transmissions</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Your credentials are password-hashed client-side, and user portal session tokens are verified server-side with zero-trust JWT validations, eliminating structural injection vulnerabilities.
            </p>
          </div>
        )}

        {/* VIEW: TERMS */}
        {activeTab === 'terms' && (
          <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6 leading-relaxed">
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">Creative Terms of Service</h1>
            <p className="text-xs text-slate-400 font-semibold">Effective Date: July 21, 2026</p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Welcome to WebMagpie digital creative platform. By accessing our specialized marketing databases or reserving consulting slots with our lead builders, you accept our standard agency policies.
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Rescheduling & Cancellations</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Clients may cancel or download campaign receipts up to 24 hours prior to their scheduled consulting slot. Cancel requests under 24 hours require coordinating with our creative partner desk directly.
            </p>
          </div>
        )}

        {/* VIEW: PATIENT BOOKING HISTORY */}
        {activeTab === 'profile' && user && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Client Hub</span>
              <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">My Secure Consultation Log</h1>
              <p className="text-sm text-slate-500">View and manage your scheduled campaign consultations, design receipts, and active scopes.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50 dark:border-slate-800">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Registered Consultation Bookings ({userAppointments.length})</span>
                <button onClick={() => { if (doctors.length > 0) initiateBooking(doctors[0]); else setActiveTab('doctors'); }} className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Reserve Another Digital Consult
                </button>
              </div>

              {userAppointments.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">No active campaign consultation history logged in database.</div>
              ) : (
                <div className="space-y-4">
                  {userAppointments.map((apt) => {
                    const doc = doctors.find(d => d.id === apt.doctorId);
                    const dept = departments.find(d => d.id === apt.departmentId);
                    return (
                      <div key={apt.id} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                        <div className="space-y-1">
                          <p className="font-extrabold text-sm text-slate-900 dark:text-white">Lead Expert: {doc ? doc.name : 'WebMagpie Specialist'}</p>
                          <p className="text-slate-500 font-semibold">{dept ? dept.name : 'Creative Design & Strategy'} Service Division</p>
                          <p className="text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-teal-600" />
                            {apt.date}
                            <Clock className="w-3.5 h-3.5 text-teal-600 ml-1.5" />
                            {apt.timeSlot}
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                          <span className={`inline-block px-2.5 py-1 rounded-full font-bold uppercase ${
                            apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' :
                            apt.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200/50' :
                            'bg-amber-50 text-amber-700 border border-amber-200/50'
                          }`}>
                            {apt.status}
                          </span>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setReceiptApt(apt);
                                setActiveTab('receipt-view');
                              }}
                              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                              title="Download Receipt Invoice"
                            >
                              <Download className="w-4 h-4 text-slate-600" />
                              Invoice
                            </button>
                            {apt.status !== 'cancelled' && (
                              <button
                                onClick={() => handleCancelBooking(apt.id)}
                                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: RECEIPT DETAILS */}
        {activeTab === 'receipt-view' && receiptApt && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">Digital Consultation Receipt</h1>
            <ReceiptDownload
              appointment={receiptApt}
              doctor={doctors.find(d => d.id === receiptApt.doctorId)}
              department={departments.find(d => d.id === receiptApt.departmentId)}
              clinicName={currentSettings.clinicName}
            />
            <button
              onClick={() => setActiveTab('profile')}
              className="text-xs font-bold text-teal-600 hover:underline cursor-pointer block mx-auto"
            >
              ← Back to consultation log
            </button>
          </div>
        )}

        {/* VIEW: ADMIN PANEL */}
        {activeTab === 'admin' && user && user.role === 'admin' && (
          <AdminDashboard
            token={token}
            doctors={doctors}
            departments={departments}
            blogs={blogs}
            users={[]}
            faqs={faqs}
            testimonials={testimonials}
            gallery={gallery}
            settings={currentSettings}
            onRefreshData={fetchWebsiteData}
          />
        )}

      </div>

      {/* DETAILED BLOG READ VIEW MODAL */}
      {activeBlogDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-2xl text-left overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setActiveBlogDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-4">
              <span className="inline-block text-[10px] bg-teal-50 px-2.5 py-1 rounded-lg text-teal-600 font-bold uppercase tracking-wider">{activeBlogDetail.category}</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">{activeBlogDetail.title}</h2>
              
              <div className="flex gap-4 text-xs text-slate-400 font-bold border-b border-slate-50 pb-3">
                <span>By {activeBlogDetail.author}</span>
                <span>• {new Date(activeBlogDetail.createdAt).toLocaleDateString()}</span>
                <span>• {activeBlogDetail.readTime}</span>
              </div>

              <div className="aspect-video rounded-2xl overflow-hidden shadow-sm">
                <img src={activeBlogDetail.image} alt={activeBlogDetail.title} className="w-full h-full object-cover" />
              </div>

              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pt-3 space-y-4">
                {activeBlogDetail.content}
              </div>

              <button
                onClick={() => {
                  const doc = doctors.find(d => d.name === activeBlogDetail.author);
                  if (doc) {
                    initiateBooking(doc);
                    setActiveBlogDetail(null);
                  } else {
                    setActiveTab('doctors');
                    setActiveBlogDetail(null);
                  }
                }}
                className="mt-6 w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
              >
                Schedule consultation with author
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secure Authentication portal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Dynamic Footer */}
      <Footer
        settings={currentSettings}
        setActiveTab={setActiveTab}
        onSubscribeNewsletter={handleSubscribeNewsletter}
      />

    </div>
  );
}
