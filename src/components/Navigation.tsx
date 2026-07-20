import { useState } from 'react';
import { Sparkles, Menu, X, Sun, Moon, User, LogOut, LayoutDashboard } from 'lucide-react';
import { User as UserType } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserType | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  clinicName: string;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  onOpenAuth,
  darkMode,
  setDarkMode,
  clinicName,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'how-we-help', label: 'How we help' },
    { id: 'who-we-help', label: 'Who we help' },
    { id: 'why-webmagpie', label: 'Why WebMagpie' },
    { id: 'departments', label: 'Services' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'FAQs' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 rounded-full bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-600/10 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5.5 h-5.5 fill-white/10" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-teal-600 dark:text-teal-400 block transition-colors leading-none">
                WebMagpie
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 block mt-0.5">
                Digital Agency
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth / Profile */}
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'admin' ? (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      activeTab === 'admin'
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <LayoutDashboard className="w-4.5 h-4.5" />
                    Admin Panel
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      activeTab === 'profile'
                        ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <User className="w-4.5 h-4.5" />
                    My Bookings
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-all cursor-pointer"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/10 hover:shadow-teal-600/20 active:scale-[0.98] cursor-pointer transition-all duration-200"
              >
                <User className="w-4.5 h-4.5" />
                Client Portal
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                activeTab === item.id
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
            {user ? (
              <div className="space-y-2 px-2">
                <div className="text-xs font-semibold text-slate-400 mb-1">
                  Signed in as: <span className="text-slate-700 dark:text-slate-200">{user.name}</span>
                </div>
                {user.role === 'admin' ? (
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                  >
                    <LayoutDashboard className="w-4.5 h-4.5" />
                    Admin Panel
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                  >
                    <User className="w-4.5 h-4.5" />
                    My Bookings
                  </button>
                )}
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsOpen(false);
                }}
                className="w-full flex justify-center items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/10"
              >
                <User className="w-4.5 h-4.5" />
                Client Portal
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
