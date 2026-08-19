import React, { useState } from 'react';
import { Sparkles, Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle2, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { ClinicSettings } from '../types';

interface FooterProps {
  settings: ClinicSettings;
  setActiveTab: (tab: string) => void;
  onSubscribeNewsletter: (email: string) => Promise<boolean>;
}

export default function Footer({ settings, setActiveTab, onSubscribeNewsletter }: FooterProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const success = await onSubscribeNewsletter(email);
      if (success) {
        setSubscribed(true);
        setEmail('');
      } else {
        setErrorMsg('Subscription failed. Please check your email.');
      }
    } catch {
      setErrorMsg('An error occurred. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className=" bg-slate-900 text-slate-300 pt-20 pb-10 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-slate-800">
          
          {/* Clinic Brand Column */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white">
                <Sparkles className="w-5.5 h-5.5 fill-white/10" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg leading-tight tracking-tight text-white block">
                  {settings.clinicName || 'WebMagpie'}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 block -mt-1">
                  Digital Agency
                </span>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed text-slate-400">
              WebMagpie delivers state-of-the-art web development, search engine optimization (SEO), and dynamic digital marketing campaigns to grow your business online.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href={settings.socialLinks?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 hover:text-white flex items-center justify-center text-slate-400 transition-all duration-250">
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a href={settings.socialLinks?.twitter || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 hover:text-white flex items-center justify-center text-slate-400 transition-all duration-250">
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a href={settings.socialLinks?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 hover:text-white flex items-center justify-center text-slate-400 transition-all duration-250">
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a href={settings.socialLinks?.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 hover:text-white flex items-center justify-center text-slate-400 transition-all duration-250">
                <Linkedin className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-5 lg:pl-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-teal-400">Useful Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home Page', tab: 'home' },
                { label: 'About Our Agency', tab: 'about' },
                { label: 'How We Help', tab: 'how-we-help' },
                { label: 'Who We Help', tab: 'who-we-help' },
                { label: 'Why WebMagpie', tab: 'why-webmagpie' },
                { label: 'Our Services', tab: 'departments' },
                { label: 'Frequently Asked Questions', tab: 'faq' },
                { label: 'Privacy Policy', tab: 'privacy' },
                { label: 'Terms of Service', tab: 'terms' }
              ].map((link, idx) => (
                <li key={idx}>
                  <button onClick={() => setActiveTab(link.tab)} className="hover:text-white hover:translate-x-1 transition-all duration-200 text-left flex items-center gap-1.5 text-slate-400 cursor-pointer">
                    <ArrowRight className="w-3.5 h-3.5 text-teal-500" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover Studio Column */}
          <div className="space-y-5 lg:pl-2">
            <h4 className="text-sm font-bold uppercase tracking-widest text-teal-400">Discover</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Meet the Experts', tab: 'doctors' },
                { label: 'Agency Blog & News', tab: 'blog' },
                { label: 'Creative Portfolio', tab: 'gallery' },
                { label: 'Client Testimonials', tab: 'testimonials' }
              ].map((link, idx) => (
                <li key={idx}>
                  <button onClick={() => setActiveTab(link.tab)} className="hover:text-white hover:translate-x-1 transition-all duration-200 text-left flex items-center gap-1.5 text-slate-400 cursor-pointer">
                    <ArrowRight className="w-3.5 h-3.5 text-teal-500" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Direct Column */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold uppercase tracking-widest text-teal-400">Agency Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span>{settings.address || 'London, United Kingdom'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-teal-500 shrink-0" />
                <span>{settings.phone || '+44 20 7946 0192'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-teal-500 shrink-0" />
                <span className="break-all">{settings.email || 'hello@webmagpie2026.com'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4.5 h-4.5 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-slate-300">Office Hours:</span>
                  <span className="text-xs">{settings.workingHours}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold uppercase tracking-widest text-teal-400">Newsletter</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Stay fully informed about cutting-edge search algorithms, tech trends, and marketing tips.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-800/80 flex items-start gap-2 text-teal-400 text-sm">
                <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Subscription Confirmed!</p>
                  <p className="text-xs text-slate-400 mt-0.5">Thank you for joining our newsletter.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-800/80 border border-slate-700/60 focus:border-teal-500 focus:outline-none text-sm text-white transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {errorMsg && <p className="text-xs text-red-400 pl-1">{errorMsg}</p>}
                <p className="text-[11px] text-slate-500 pl-1">
                  Join <span className="text-teal-400 font-semibold">{settings.newsletterCount}</span> active business owners.
                </p>
              </form>
            )}
          </div>

        </div>

        {/* Copy / Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} WebMagpie Digital Agency. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => setActiveTab('privacy')} className="hover:text-slate-300 cursor-pointer">Privacy Policy</button>
            <button onClick={() => setActiveTab('terms')} className="hover:text-slate-300 cursor-pointer">Terms & Conditions</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
