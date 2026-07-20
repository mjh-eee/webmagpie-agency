export type UserRole = 'patient' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  departmentId: string;
  experience: number; // in years
  rating: number;
  consultations: number;
  image: string;
  bio: string;
  availableDays: string[]; // e.g. ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  availableSlots: string[]; // e.g. ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"]
  fee: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon identifier
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  departmentId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  fee: number;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string;
  readTime: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  feedback: string;
  avatar: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  url: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface ClinicSettings {
  clinicName: string;
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  seoTitle: string;
  seoDescription: string;
  newsletterCount: number;
}

export interface AppDatabase {
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
