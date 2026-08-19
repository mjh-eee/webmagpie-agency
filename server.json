import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { AppDatabase, User, Doctor, Department, Appointment, Blog, Testimonial, FAQ, ClinicSettings, ContactMessage, GalleryItem } from './src/types';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'server-db.json');
const SECRET = process.env.GEMINI_API_KEY || 'clinical-secret-key-123-antigravity';

// Helper for JSON Database Loading and Saving
function loadDatabase(): AppDatabase {
  if (!fs.existsSync(DB_FILE)) {
    const seed = getSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error parsing database file, regenerating defaults:', err);
    const seed = getSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  }
}

function saveDatabase(db: AppDatabase) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

// Password Hashing helpers using native Node Crypto (very safe and fast)
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':');
    const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === checkHash;
  } catch (e) {
    return false;
  }
}

// Custom JWT sign and verify helpers
function signToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): any {
  try {
    const [header, body, signature] = token.split('.');
    const checkSig = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== checkSig) return null;
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

// Authentication Middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(411).json({ error: 'Access token required' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(403).json({ error: 'Invalid or expired token' });

  req.user = decoded;
  next();
}

// Seed Data definition
function getSeedData(): AppDatabase {
  const defaultAdminPassword = hashPassword('admin123');
  const defaultPatientPassword = hashPassword('patient123');

  const users: User[] = [
    {
      id: 'usr_admin',
      name: 'WebMagpie Admin',
      email: 'jewel.eee.kuet@gmail.com',
      passwordHash: defaultAdminPassword,
      role: 'admin',
      emailVerified: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr_patient',
      name: 'John Client',
      email: 'patient@test.com',
      passwordHash: defaultPatientPassword,
      role: 'patient',
      emailVerified: true,
      createdAt: new Date().toISOString()
    }
  ];

  const departments: Department[] = [
    { id: 'dept_webdev', name: 'Web Development', description: 'Expert full-stack development, custom web applications, SaaS platform design, and secure e-commerce integrations.', iconName: 'LayoutDashboard' },
    { id: 'dept_seo', name: 'Search Engine Optimization', description: 'Data-driven search campaigns, technical site audits, backlink strategies, and maximum organic visibility.', iconName: 'Search' },
    { id: 'dept_marketing', name: 'Digital Marketing & PPC', description: 'High-performance social media marketing, pay-per-click ads, sales funnel architecture, and lead generation.', iconName: 'Layers' },
    { id: 'dept_design', name: 'UI/UX & Branding', description: 'Aesthetic wireframes, vector identity kits, conversion-centric interactive layouts, and user research.', iconName: 'Sparkles' },
    { id: 'dept_analytics', name: 'Analytics & GA4', description: 'Google Analytics 4 setup, pixel conversion tracking, heatmap analysis, and custom ROI dashboards.', iconName: 'Activity' },
    { id: 'dept_copywriting', name: 'Content Strategy', description: 'Persuasive copywriting, SEO-optimized blogs, high-converting copy, and brand storytelling.', iconName: 'FileText' }
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
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      bio: 'Sarah Connor is a seasoned web application architect specializing in high-scale React, TypeScript, and robust API development. She has delivered over 300+ custom business portals.',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
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
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      bio: 'Alan is an industry veteran in high-impact search engine optimization, specialized keywords mapping, link acquisition, and technical search positioning to outpace market rivals.',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableSlots: ['09:30 AM', '10:30 AM', '11:30 AM', '01:30 PM', '02:30 PM', '04:00 PM'],
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
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
      bio: 'Ellie leads our growth advertising division, managing PPC ads, Facebook & Google high-performance copy funnels, and programmatic advertising campaigns that scale direct client revenue.',
      availableDays: ['Tuesday', 'Thursday', 'Friday'],
      availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
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
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
      bio: 'Ian is passionate about user-centric responsive layout design, interactive prototype styling, wireframes mapping, and visual identity guides that build client credibility.',
      availableDays: ['Monday', 'Tuesday', 'Friday'],
      availableSlots: ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'],
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
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      bio: 'John specializes in business intelligence tools, conversion tracking infrastructure, advanced Google Tag Manager routines, and building real-time dashboard analytics.',
      availableDays: ['Wednesday', 'Thursday'],
      availableSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'],
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
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
      bio: 'Henry specializes in direct-response copy, search-intent optimization, persuasive sales letters, landing pages optimization, and high-converting marketing campaigns.',
      availableDays: ['Monday', 'Tuesday', 'Thursday'],
      availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
      fee: 95
    }
  ];

  const appointments: Appointment[] = [
    {
      id: 'apt_1',
      userId: 'usr_patient',
      doctorId: 'doc_sarah',
      departmentId: 'dept_webdev',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '10:00 AM',
      status: 'confirmed',
      notes: 'Initial requirements discovery session for a new corporate website portal.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      patientName: 'John Client',
      patientEmail: 'patient@test.com',
      patientPhone: '+1 (555) 987-6543',
      fee: 150
    }
  ];

  const blogs: Blog[] = [
    {
      id: 'blog_1',
      title: '7 Practical SEO Tactics for Immediate Traffic Growth',
      excerpt: 'Organic search is the highest ROI marketing channel. Learn key insights on modern search placement, schema structured data, and authoritative backlinks.',
      content: `Search engine optimization remains the primary source of qualified web traffic globally. Yet over 90% of pages get zero organic views. Learn how to rank #1.\n\n### 1. High-Value Search Intent\nMap your content directly to what users are searching. Prioritize specific long-tail informational queries over generic commercial terms.\n\n### 2. Deep Site Audits\nAnalyze load speeds, mobile responsiveness, and clean XML sitemap indexing to guarantee search crawlers can index your brand efficiently.\n\n### 3. Trustworthy Link Acquisition\nCultivate natural authority by authoring original reports and data guides that other domains naturally want to reference.\n\nAt WebMagpie Digital Agency, we construct precise organic roadmaps that drive growth. Book a search consultation today.`,
      category: 'Search Engine Optimization',
      author: 'Alan Grant',
      image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&q=80&w=800',
      readTime: '5 min read',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'blog_2',
      title: 'Why High-Performance Web Development is Your Best Marketing Asset',
      excerpt: 'A slow website destroys conversion rates. Discover how speed optimization, modern responsive framework code, and pristine UI/UX keep leads engaged.',
      content: `Your website is your 24/7 digital salesperson. If it takes longer than 2.5 seconds to load, over 50% of your potential leads will leave.\n\n### Speed is Relevance\nGoogle uses page experience and core web vitals directly in search page ranking formulas. Clean React and static generation guarantee maximum speed.\n\n### Creating high-converting customer journeys\nTo optimize conversion paths:\n- Center a single, clear primary Call-To-Action (CTA).\n- Clean up visual noise and utilize generous white space.\n- Build trusted payment gateways and secure portals.\n\nSchedule a web consultation with Sarah Connor for custom development roadmaps.`,
      category: 'Web Development',
      author: 'Sarah Connor',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      readTime: '6 min read',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'blog_3',
      title: 'A Masterclass in High-ROI Paid Ad Funnels for Modern Brands',
      excerpt: 'Scaling budget on Facebook or Google without conversion optimization is a recipe for high burn rates. Follow our three-step conversion funnel blueprint.',
      content: `Paid marketing is a supercharger, but only when fueled by robust tracking and persuasive copy. Learn to lower acquisition costs.\n\n### 1. Granular Audience Definitions\nStop targeting generic interests. Leverage custom seed lists, lookalikes, and contextual behaviors to target buyers.\n\n### 2. Conversational Hook Copy\nEngage prospects with actual pain points. Address their immediate objections directly in the first line of ad text.\n\nConsult Ellie Sattler for specialized ad account diagnostics and multi-channel marketing campaigns.`,
      category: 'Digital Marketing & PPC',
      author: 'Ellie Sattler',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800',
      readTime: '4 min read',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const testimonials: Testimonial[] = [
    { id: 't1', name: 'Sophia Sterling', role: 'Founder, HealthFlow', rating: 5, feedback: 'WebMagpie delivered an outstanding React platform. Our online bookings grew by 240% in the first quarter, and our technical search ranking reached the front page.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
    { id: 't2', name: 'Marcus Brody', role: 'CMO, Apex Logistics', rating: 5, feedback: 'Their SEO strategy is unmatched. We are now ranking for highly competitive terms that we thought were impossible to capture. Highly recommended!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
    { id: 't3', name: 'Alena Voronova', role: 'Director, Glow Cosmetics', rating: 5, feedback: 'The UX redesign WebMagpie built is breathtaking. The conversion rate on our checkout jumped from 1.8% to 4.2% within two weeks.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' }
  ];

  const gallery: GalleryItem[] = [
    { id: 'gal_1', title: 'WebMagpie Collaborative Space', category: 'Agency', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600' },
    { id: 'gal_2', title: 'Interactive SaaS Dashboard', category: 'Projects', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600' },
    { id: 'gal_3', title: 'Google Analytics ROI Board', category: 'Diagnostics', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600' },
    { id: 'gal_4', title: 'Creative Wireframe & Strategy', category: 'Agency', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600' },
    { id: 'gal_5', title: 'Secure E-Commerce Storefront', category: 'Projects', url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=600' },
    { id: 'gal_6', title: 'Our Core Engineering Team', category: 'Team', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600' }
  ];

  const faqs: FAQ[] = [
    { id: 'f1', question: 'How do I schedule an initial project discovery consultation?', answer: 'Navigate to the Booking section, select your target service and consultant, pick an open date and slot, enter your project details, and submit.', category: 'Booking' },
    { id: 'f2', question: 'Can I cancel or reschedule my consultation slot?', answer: 'Yes, clients can log into their secure portal, navigate to the consultation history tab, and reschedule or cancel their sessions instantly.', category: 'Management' },
    { id: 'f3', question: 'What tech stack do you recommend for SaaS or custom products?', answer: 'We specialize in high-performance frameworks like React, Next.js, Tailwind CSS, TypeScript, and robust server databases to guarantee speed, accessibility, and clean code.', category: 'Technology' },
    { id: 'f4', question: 'Do you provide detailed technical SEO audits before starting?', answer: 'Yes, every search engine campaign begins with a comprehensive audit of your technical architecture, speed, indexing, and keyword footprint.', category: 'SEO' }
  ];

  const settings: ClinicSettings = {
    clinicName: 'WebMagpie Agency',
    email: 'info@webmagpie.com',
    phone: '+1 (555) 321-9876',
    address: 'Suite 400, 100 Innovation Way, Tech District, San Francisco',
    workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM (EST)',
    socialLinks: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    },
    seoTitle: 'WebMagpie - Premium Web Development, SEO, and Digital Marketing Agency',
    seoDescription: 'WebMagpie is an elite digital marketing agency specializing in high-performance web development, SEO organic visibility, social media ads, and bespoke UI/UX design.',
    newsletterCount: 382
  };

  const contactMessages: ContactMessage[] = [
    { id: 'm1', name: 'Alice Watson', email: 'alice@test.com', subject: 'Corporate Website Overhaul', message: 'Do you offer custom SLA packages and ongoing support for enterprise application management?', status: 'unread', createdAt: new Date().toISOString() }
  ];

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

// RESTful API Routes implementation
app.use(express.json());

// Auth Endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const db = loadDatabase();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const newUser: User = {
    id: `usr_${crypto.randomUUID()}`,
    name,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    role: 'patient',
    emailVerified: true,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDatabase(db);

  const token = signToken({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
  res.status(201).json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, emailVerified: newUser.emailVerified }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = loadDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified }
  });
});

app.get('/api/auth/me', authenticateToken, (req: any, res) => {
  const db = loadDatabase();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified });
});

// Settings Endpoints
app.get('/api/settings', (req, res) => {
  const db = loadDatabase();
  res.json(db.settings);
});

app.put('/api/settings', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const db = loadDatabase();
  db.settings = { ...db.settings, ...req.body };
  saveDatabase(db);
  res.json(db.settings);
});

// Newsletter subscription
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const db = loadDatabase();
  db.settings.newsletterCount += 1;
  saveDatabase(db);
  res.json({ success: true, count: db.settings.newsletterCount });
});

// Departments Endpoints
app.get('/api/departments', (req, res) => {
  const db = loadDatabase();
  res.json(db.departments);
});

app.post('/api/departments', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const { name, description, iconName } = req.body;
  if (!name || !description) return res.status(400).json({ error: 'Name and description required' });

  const db = loadDatabase();
  const newDept: Department = {
    id: `dept_${crypto.randomUUID()}`,
    name,
    description,
    iconName: iconName || 'Activity'
  };
  db.departments.push(newDept);
  saveDatabase(db);
  res.status(201).json(newDept);
});

app.put('/api/departments/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const db = loadDatabase();
  const index = db.departments.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Department not found' });

  db.departments[index] = { ...db.departments[index], ...req.body };
  saveDatabase(db);
  res.json(db.departments[index]);
});

app.delete('/api/departments/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const db = loadDatabase();
  db.departments = db.departments.filter(d => d.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Doctors Endpoints
app.get('/api/doctors', (req, res) => {
  const db = loadDatabase();
  res.json(db.doctors);
});

app.post('/api/doctors', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const { name, specialization, departmentId, experience, bio, availableDays, availableSlots, fee, image } = req.body;
  if (!name || !specialization || !departmentId) return res.status(400).json({ error: 'Name, specialization, and department ID required' });

  const db = loadDatabase();
  const newDoc: Doctor = {
    id: `doc_${crypto.randomUUID()}`,
    name,
    specialization,
    departmentId,
    experience: Number(experience) || 1,
    rating: 5.0,
    consultations: 0,
    image: image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    bio: bio || '',
    availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday'],
    availableSlots: availableSlots || ['10:00 AM', '11:00 AM', '02:00 PM'],
    fee: Number(fee) || 100
  };
  db.doctors.push(newDoc);
  saveDatabase(db);
  res.status(201).json(newDoc);
});

app.put('/api/doctors/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const db = loadDatabase();
  const index = db.doctors.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Doctor not found' });

  db.doctors[index] = { ...db.doctors[index], ...req.body };
  saveDatabase(db);
  res.json(db.doctors[index]);
});

app.delete('/api/doctors/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const db = loadDatabase();
  db.doctors = db.doctors.filter(d => d.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Appointments Endpoints
app.get('/api/appointments', authenticateToken, (req: any, res) => {
  const db = loadDatabase();
  if (req.user.role === 'admin') {
    res.json(db.appointments);
  } else {
    const userApts = db.appointments.filter(a => a.userId === req.user.id);
    res.json(userApts);
  }
});

app.post('/api/appointments', authenticateToken, (req: any, res) => {
  const { doctorId, departmentId, date, timeSlot, notes, patientName, patientEmail, patientPhone } = req.body;
  if (!doctorId || !departmentId || !date || !timeSlot || !patientName || !patientEmail || !patientPhone) {
    return res.status(400).json({ error: 'Missing mandatory appointment fields' });
  }

  const db = loadDatabase();
  const doctor = db.doctors.find(d => d.id === doctorId);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

  const newApt: Appointment = {
    id: `apt_${crypto.randomUUID()}`,
    userId: req.user.id,
    doctorId,
    departmentId,
    date,
    timeSlot,
    status: 'pending',
    notes,
    createdAt: new Date().toISOString(),
    patientName,
    patientEmail,
    patientPhone,
    fee: doctor.fee
  };

  db.appointments.push(newApt);
  doctor.consultations += 1; // Increment doctor total consults on booking
  saveDatabase(db);

  res.status(201).json(newApt);
});

app.put('/api/appointments/:id/status', authenticateToken, (req: any, res) => {
  const { status } = req.body;
  if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid appointment status' });
  }

  const db = loadDatabase();
  const index = db.appointments.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Appointment not found' });

  const apt = db.appointments[index];
  // Verify permissions: Admin can do anything, Patient can only cancel their own
  if (req.user.role !== 'admin') {
    if (apt.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized to modify this appointment' });
    if (status !== 'cancelled') return res.status(403).json({ error: 'Patients can only cancel appointments' });
  }

  apt.status = status;
  saveDatabase(db);
  res.json(apt);
});

app.delete('/api/appointments/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const db = loadDatabase();
  db.appointments = db.appointments.filter(a => a.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Blogs Endpoints
app.get('/api/blogs', (req, res) => {
  const db = loadDatabase();
  res.json(db.blogs);
});

app.post('/api/blogs', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const { title, excerpt, content, category, author, image, readTime } = req.body;
  if (!title || !content || !category) return res.status(400).json({ error: 'Title, content, and category required' });

  const db = loadDatabase();
  const newBlog: Blog = {
    id: `blog_${crypto.randomUUID()}`,
    title,
    excerpt: excerpt || content.substring(0, 150) + '...',
    content,
    category,
    author: author || 'Clinic Administrator',
    image: image || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    readTime: readTime || '4 min read',
    createdAt: new Date().toISOString()
  };
  db.blogs.push(newBlog);
  saveDatabase(db);
  res.status(201).json(newBlog);
});

app.put('/api/blogs/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const db = loadDatabase();
  const index = db.blogs.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Blog not found' });

  db.blogs[index] = { ...db.blogs[index], ...req.body };
  saveDatabase(db);
  res.json(db.blogs[index]);
});

app.delete('/api/blogs/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const db = loadDatabase();
  db.blogs = db.blogs.filter(b => b.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Testimonials Endpoints
app.get('/api/testimonials', (req, res) => {
  const db = loadDatabase();
  res.json(db.testimonials);
});

app.post('/api/testimonials', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const { name, role, rating, feedback, avatar } = req.body;
  if (!name || !feedback) return res.status(400).json({ error: 'Name and feedback required' });

  const db = loadDatabase();
  const newTestimonial: Testimonial = {
    id: `t_${crypto.randomUUID()}`,
    name,
    role: role || 'Patient',
    rating: Number(rating) || 5,
    feedback,
    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  };
  db.testimonials.push(newTestimonial);
  saveDatabase(db);
  res.status(201).json(newTestimonial);
});

app.delete('/api/testimonials/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const db = loadDatabase();
  db.testimonials = db.testimonials.filter(t => t.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Gallery Endpoints
app.get('/api/gallery', (req, res) => {
  const db = loadDatabase();
  res.json(db.gallery);
});

app.post('/api/gallery', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const { title, category, url } = req.body;
  if (!title || !category || !url) return res.status(400).json({ error: 'Title, category, and url required' });

  const db = loadDatabase();
  const item = { id: `gal_${crypto.randomUUID()}`, title, category, url };
  db.gallery.push(item);
  saveDatabase(db);
  res.status(201).json(item);
});

app.delete('/api/gallery/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const db = loadDatabase();
  db.gallery = db.gallery.filter(g => g.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// FAQs Endpoints
app.get('/api/faqs', (req, res) => {
  const db = loadDatabase();
  res.json(db.faqs);
});

app.post('/api/faqs', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const { question, answer, category } = req.body;
  if (!question || !answer) return res.status(400).json({ error: 'Question and answer required' });

  const db = loadDatabase();
  const faq: FAQ = {
    id: `faq_${crypto.randomUUID()}`,
    question,
    answer,
    category: category || 'General'
  };
  db.faqs.push(faq);
  saveDatabase(db);
  res.status(201).json(faq);
});

app.delete('/api/faqs/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const db = loadDatabase();
  db.faqs = db.faqs.filter(f => f.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Contact messages Endpoints
app.get('/api/contact-messages', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const db = loadDatabase();
  res.json(db.contactMessages);
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email, and message required' });

  const db = loadDatabase();
  const newMsg: ContactMessage = {
    id: `msg_${crypto.randomUUID()}`,
    name,
    email,
    subject: subject || 'General Query',
    message,
    status: 'unread',
    createdAt: new Date().toISOString()
  };
  db.contactMessages.push(newMsg);
  saveDatabase(db);
  res.status(201).json(newMsg);
});

app.put('/api/contact-messages/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const { status } = req.body;
  const db = loadDatabase();
  const index = db.contactMessages.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Message not found' });

  db.contactMessages[index].status = status;
  saveDatabase(db);
  res.json(db.contactMessages[index]);
});

app.delete('/api/contact-messages/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  const db = loadDatabase();
  db.contactMessages = db.contactMessages.filter(m => m.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Admin Analytics Endpoint
app.get('/api/analytics', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });

  const db = loadDatabase();
  const totalDoctors = db.doctors.length;
  const totalDepartments = db.departments.length;
  const totalPatients = db.users.filter(u => u.role === 'patient').length;
  const totalAppointments = db.appointments.length;

  const confirmedApts = db.appointments.filter(a => a.status === 'confirmed').length;
  const pendingApts = db.appointments.filter(a => a.status === 'pending').length;
  const cancelledApts = db.appointments.filter(a => a.status === 'cancelled').length;

  const totalRevenue = db.appointments
    .filter(a => a.status === 'confirmed')
    .reduce((acc, a) => acc + (a.fee || 100), 0);

  // Group appointments by date for trends
  const appointmentsByDate: { [key: string]: number } = {};
  db.appointments.forEach(a => {
    const d = a.date;
    appointmentsByDate[d] = (appointmentsByDate[d] || 0) + 1;
  });

  const chartData = Object.keys(appointmentsByDate)
    .sort()
    .slice(-7) // last 7 booking dates
    .map(date => ({
      date,
      appointments: appointmentsByDate[date]
    }));

  res.json({
    summary: {
      totalDoctors,
      totalDepartments,
      totalPatients,
      totalAppointments,
      confirmedApts,
      pendingApts,
      cancelledApts,
      totalRevenue
    },
    chartData
  });
});

// Vite + Static Asset Serving Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA Fallback for index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server successfully running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
