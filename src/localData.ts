// localData.ts
// A drop-in, frontend-only replacement for server.ts.
// All "API calls" become plain functions that read/write localStorage.
// No network requests, no Express, no server-db.json.

import {
    User,
    Doctor,
    Department,
    Appointment,
    Blog,
    Testimonial,
    FAQ,
    ClinicSettings,
    ContactMessage,
    GalleryItem
  } from './types';
  
  const DB_KEY = 'webmagpie_local_db_v1';
  
  interface AppDatabase {
    users: User[];
    doctors: Doctor[];
    departments: Department[];
    appointments: Appointment[];
    blogs: Blog[];
    testimonials: Testimonial[];
    gallery: GalleryItem[];
    faqs: FAQ[];
    settings: ClinicSettings;
    contactMessages: ContactMessage[];
  }
  
  // ---------- Seed data ----------
  function getSeedData(): AppDatabase {
    const users: User[] = [
      {
        id: 'usr_admin',
        name: 'WebMagpie Admin',
        email: 'admin@test.com',
        passwordHash: 'admin123',
        role: 'admin',
        emailVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_patient',
        name: 'John Client',
        email: 'patient@test.com',
        passwordHash: 'patient123',
        role: 'patient',
        emailVerified: true,
        createdAt: new Date().toISOString()
      }
    ];
  
    const departments: Department[] = [
      {
        id: 'dept_webdev',
        name: 'Web Development',
        description:
          'Expert full-stack development, custom web applications, SaaS platform design, and secure e-commerce integrations.',
        iconName: 'LayoutDashboard'
      },
      {
        id: 'dept_seo',
        name: 'Search Engine Optimization',
        description:
          'Data-driven search campaigns, technical site audits, backlink strategies, and maximum organic visibility.',
        iconName: 'Search'
      },
      {
        id: 'dept_marketing',
        name: 'Digital Marketing & PPC',
        description:
          'High-performance social media marketing, pay-per-click ads, sales funnel architecture, and lead generation.',
        iconName: 'Layers'
      },
      {
        id: 'dept_design',
        name: 'UI/UX & Branding',
        description:
          'Aesthetic wireframes, vector identity kits, conversion-centric interactive layouts, and user research.',
        iconName: 'Sparkles'
      },
      {
        id: 'dept_analytics',
        name: 'Analytics & GA4',
        description:
          'Google Analytics 4 setup, pixel conversion tracking, heatmap analysis, and custom ROI dashboards.',
        iconName: 'Activity'
      },
      {
        id: 'dept_copywriting',
        name: 'Content Strategy',
        description:
          'Persuasive copywriting, SEO-optimized blogs, high-converting copy, and brand storytelling.',
        iconName: 'FileText'
      }
    ];
  
    const doctors: Doctor[] = [
      {
        id: 'doc_sarah',
        name: 'Sarah Connor',
        specialization: 'Principal Web Architect',
        departmentId: 'dept_webdev',
        experience: 12,
        rating: 4.9,
        consultations: 1250,
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        bio:
          'Sarah Connor is a seasoned web application architect specializing in high-scale React, TypeScript, and robust API development.',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        availableSlots: [
          '09:00 AM',
          '10:00 AM',
          '11:00 AM',
          '02:00 PM',
          '03:00 PM'
        ],
        fee: 150
      },
      {
        id: 'doc_alan',
        name: 'Alan Grant',
        specialization: 'SEO & Organic Growth Director',
        departmentId: 'dept_seo',
        experience: 15,
        rating: 4.8,
        consultations: 1840,
        image:
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
        bio: 'Alan is an industry veteran in high-impact search engine optimization.',
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableSlots: [
          '09:30 AM',
          '10:30 AM',
          '11:30 AM',
          '01:30 PM',
          '02:30 PM',
          '04:00 PM'
        ],
        fee: 120
      },
      {
        id: 'doc_ellie',
        name: 'Ellie Sattler',
        specialization: 'Paid Acquisition & Marketing Lead',
        departmentId: 'dept_marketing',
        experience: 10,
        rating: 4.9,
        consultations: 950,
        image:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
        bio: 'Ellie leads our growth advertising division.',
        availableDays: ['Tuesday', 'Thursday', 'Friday'],
        availableSlots: [
          '10:00 AM',
          '11:00 AM',
          '02:00 PM',
          '03:00 PM',
          '04:00 PM'
        ],
        fee: 180
      },
      {
        id: 'doc_ian',
        name: 'Ian Malcolm',
        specialization: 'Lead UI/UX Designer',
        departmentId: 'dept_design',
        experience: 8,
        rating: 4.7,
        consultations: 820,
        image:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
        bio: 'Ian is passionate about user-centric responsive layout design.',
        availableDays: ['Monday', 'Tuesday', 'Friday'],
        availableSlots: [
          '09:00 AM',
          '11:00 AM',
          '01:00 PM',
          '03:00 PM',
          '05:00 PM'
        ],
        fee: 110
      },
      {
        id: 'doc_john',
        name: 'John Hammond',
        specialization: 'Director of Analytics & GA4',
        departmentId: 'dept_analytics',
        experience: 20,
        rating: 4.9,
        consultations: 2500,
        image:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        bio: 'John specializes in business intelligence tools.',
        availableDays: ['Wednesday', 'Thursday'],
        availableSlots: [
          '08:00 AM',
          '09:00 AM',
          '10:00 AM',
          '11:00 AM',
          '01:00 PM',
          '02:00 PM'
        ],
        fee: 200
      },
      {
        id: 'doc_henry',
        name: 'Henry Wu',
        specialization: 'Conversion & Copy Specialist',
        departmentId: 'dept_copywriting',
        experience: 9,
        rating: 4.6,
        consultations: 710,
        image:
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
        bio: 'Henry specializes in direct-response copy.',
        availableDays: ['Monday', 'Tuesday', 'Thursday'],
        availableSlots: [
          '09:00 AM',
          '10:00 AM',
          '11:00 AM',
          '02:00 PM',
          '03:00 PM'
        ],
        fee: 95
      }
    ];
  
    const appointments: Appointment[] = [];
  
    const blogs: Blog[] = [
      {
        id: 'blog_1',
        title: '7 Practical SEO Tactics for Immediate Traffic Growth',
        excerpt: 'Organic search is the highest ROI marketing channel.',
        content:
          'Search engine optimization remains the primary source of qualified web traffic globally...',
        category: 'Search Engine Optimization',
        author: 'Alan Grant',
        image:
          'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&q=80&w=800',
        readTime: '5 min read',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
      },
      {
        id: 'blog_2',
        title:
          'Why High-Performance Web Development is Your Best Marketing Asset',
        excerpt: 'A slow website destroys conversion rates.',
        content: 'Your website is your 24/7 digital salesperson...',
        category: 'Web Development',
        author: 'Sarah Connor',
        image:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        readTime: '6 min read',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'blog_3',
        title: 'A Masterclass in High-ROI Paid Ad Funnels',
        excerpt:
          'Scaling budget without conversion optimization burns cash.',
        content:
          'Paid marketing is a supercharger, but only when fueled by robust tracking...',
        category: 'Digital Marketing & PPC',
        author: 'Ellie Sattler',
        image:
          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800',
        readTime: '4 min read',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
      }
    ];
  
    const testimonials: Testimonial[] = [
      {
        id: 't1',
        name: 'Sophia Sterling',
        role: 'Founder, HealthFlow',
        rating: 5,
        feedback:
          'WebMagpie delivered an outstanding React platform. Our online bookings grew by 240% in the first quarter.',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
      },
      {
        id: 't2',
        name: 'Marcus Brody',
        role: 'CMO, Apex Logistics',
        rating: 5,
        feedback:
          'Their SEO strategy is unmatched. We are now ranking for highly competitive terms.',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
      },
      {
        id: 't3',
        name: 'Alena Voronova',
        role: 'Director, Glow Cosmetics',
        rating: 5,
        feedback:
          'The UX redesign is breathtaking. Our checkout conversion jumped from 1.8% to 4.2%.',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
      }
    ];
  
    const gallery: GalleryItem[] = [
      {
        id: 'gal_1',
        title: 'WebMagpie Collaborative Space',
        category: 'Agency',
        url:
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'gal_2',
        title: 'Interactive SaaS Dashboard',
        category: 'Projects',
        url:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'gal_3',
        title: 'Google Analytics ROI Board',
        category: 'Diagnostics',
        url:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'gal_4',
        title: 'Creative Wireframe & Strategy',
        category: 'Agency',
        url:
          'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'gal_5',
        title: 'Secure E-Commerce Storefront',
        category: 'Projects',
        url:
          'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'gal_6',
        title: 'Our Core Engineering Team',
        category: 'Team',
        url:
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'
      }
    ];
  
    const faqs: FAQ[] = [
      {
        id: 'f1',
        question:
          'How do I schedule an initial project discovery consultation?',
        answer:
          'Navigate to the Booking section, select your target service and consultant, pick an open date and slot, enter your project details, and submit.',
        category: 'Booking'
      },
      {
        id: 'f2',
        question: 'Can I cancel or reschedule my consultation slot?',
        answer:
          'Yes, log into your portal, go to your consultation history, and reschedule or cancel instantly.',
        category: 'Management'
      },
      {
        id: 'f3',
        question:
          'What tech stack do you recommend for SaaS or custom products?',
        answer:
          'React, Next.js, Tailwind CSS, TypeScript, and robust databases for speed and clean code.',
        category: 'Technology'
      },
      {
        id: 'f4',
        question:
          'Do you provide detailed technical SEO audits before starting?',
        answer:
          'Yes, every campaign begins with a comprehensive technical audit.',
        category: 'SEO'
      }
    ];
  
    const settings: ClinicSettings = {
      clinicName: 'WebMagpie Agency',
      email: 'info@webmagpie.com',
      phone: '+1 (555) 321-9876',
      address:
        'Suite 400, 100 Innovation Way, Tech District, San Francisco',
      workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM (EST)',
      socialLinks: {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com'
      },
      seoTitle:
        'WebMagpie - Premium Web Development, SEO, and Digital Marketing Agency',
      seoDescription:
        'WebMagpie is an elite digital marketing agency specializing in high-performance web development, SEO, social media ads, and bespoke UI/UX design.',
      newsletterCount: 382
    };
  
    const contactMessages: ContactMessage[] = [];
  
    return {
      users,
      doctors,
      departments,
      appointments,
      blogs,
      testimonials,
      gallery,
      faqs,
      settings,
      contactMessages
    };
  }
  
  // ---------- Load / Save ----------
  function loadDB(): AppDatabase {
    try {
      const raw = localStorage.getItem(DB_KEY);
  
      if (!raw) {
        const seed = getSeedData();
        localStorage.setItem(DB_KEY, JSON.stringify(seed));
        return seed;
      }
  
      return JSON.parse(raw);
    } catch {
      const seed = getSeedData();
      localStorage.setItem(DB_KEY, JSON.stringify(seed));
      return seed;
    }
  }
  
  function saveDB(db: AppDatabase) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }
  
  function uid(prefix: string) {
    return `${prefix}_${Math.random()
      .toString(36)
      .slice(2, 10)}${Date.now().toString(36)}`;
  }
  
  // ---------- Public functions ----------
  
  export function getWebsiteData() {
    const db = loadDB();
  
    return {
      doctors: db.doctors,
      departments: db.departments,
      blogs: db.blogs,
      testimonials: db.testimonials,
      gallery: db.gallery,
      faqs: db.faqs,
      settings: db.settings
    };
  }
  
  export function login(
    email: string,
    password: string
  ): { user: User; error?: string } | { error: string } {
    const db = loadDB();
  
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  
    if (!user || user.passwordHash !== password) {
      return { error: 'Invalid email or password' };
    }
  
    return { user };
  }
  
  export function register(
    name: string,
    email: string,
    password: string
  ): { user: User } | { error: string } {
    const db = loadDB();
  
    if (
      db.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      return { error: 'Email already registered' };
    }
  
    const newUser: User = {
      id: uid('usr'),
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      role: 'patient',
      emailVerified: true,
      createdAt: new Date().toISOString()
    };
  
    db.users.push(newUser);
    saveDB(db);
  
    return { user: newUser };
  }
  
  export function getUserAppointments(
    userId: string,
    isAdmin: boolean
  ): Appointment[] {
    const db = loadDB();
  
    return isAdmin
      ? db.appointments
      : db.appointments.filter((a) => a.userId === userId);
  }
  
  export function bookAppointment(
    userId: string,
    payload: {
      doctorId: string;
      departmentId: string;
      date: string;
      timeSlot: string;
      notes?: string;
      patientName: string;
      patientEmail: string;
      patientPhone: string;
    }
  ): { appointment: Appointment } | { error: string } {
    const db = loadDB();
  
    const doctor = db.doctors.find(
      (d) => d.id === payload.doctorId
    );
  
    if (!doctor) {
      return { error: 'Doctor not found' };
    }
  
    const apt: Appointment = {
      id: uid('apt'),
      userId,
      doctorId: payload.doctorId,
      departmentId: payload.departmentId,
      date: payload.date,
      timeSlot: payload.timeSlot,
      status: 'pending',
      notes: payload.notes,
      createdAt: new Date().toISOString(),
      patientName: payload.patientName,
      patientEmail: payload.patientEmail,
      patientPhone: payload.patientPhone,
      fee: doctor.fee
    };
  
    db.appointments.push(apt);
    doctor.consultations += 1;
  
    saveDB(db);
  
    return { appointment: apt };
  }
  
  export function cancelAppointment(aptId: string): boolean {
    const db = loadDB();
  
    const apt = db.appointments.find(
      (a) => a.id === aptId
    );
  
    if (!apt) {
      return false;
    }
  
    apt.status = 'cancelled';
  
    saveDB(db);
  
    return true;
  }
  
  export function submitContactMessage(payload: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) {
    const db = loadDB();
  
    const msg: ContactMessage = {
      id: uid('msg'),
      name: payload.name,
      email: payload.email,
      subject: payload.subject || 'General Query',
      message: payload.message,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
  
    db.contactMessages.push(msg);
  
    saveDB(db);
  
    return msg;
  }
  
  export function subscribeNewsletter(): number {
    const db = loadDB();
  
    db.settings.newsletterCount += 1;
  
    saveDB(db);
  
    return db.settings.newsletterCount;
  }
  
  // ---------- Generic admin CRUD helpers ----------
  
  export function addItem<K extends keyof AppDatabase>(
    key: K,
    item: any
  ) {
    const db = loadDB();
  
    (db[key] as any[]).push(item);
  
    saveDB(db);
  
    return item;
  }
  
  export function updateItem<K extends keyof AppDatabase>(
    key: K,
    id: string,
    patch: any
  ) {
    const db = loadDB();
  
    const arr = db[key] as any[];
  
    const idx = arr.findIndex((i) => i.id === id);
  
    if (idx === -1) {
      return null;
    }
  
    arr[idx] = {
      ...arr[idx],
      ...patch
    };
  
    saveDB(db);
  
    return arr[idx];
  }
  
  export function deleteItem<K extends keyof AppDatabase>(
    key: K,
    id: string
  ) {
    const db = loadDB();
  
    (db as any)[key] = (db[key] as any[]).filter(
      (i) => i.id !== id
    );
  
    saveDB(db);
  
    return true;
  }