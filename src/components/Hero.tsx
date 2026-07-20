import { Sparkles, Code, ShieldCheck, Star } from 'lucide-react';

interface HeroProps {
  onBookClick: () => void;
  clinicName: string;
}

export default function Hero({ onBookClick, clinicName }: HeroProps) {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-teal-50/60 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 py-24 sm:py-32 transition-colors duration-300">
      
      {/* Background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200/25 dark:bg-teal-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-12 w-80 h-80 bg-indigo-200/30 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/60 dark:bg-teal-950/40 border border-teal-200/50 dark:border-teal-900/30 text-[11px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Scale Your Digital Footprint</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-slate-950 dark:text-white leading-[1.05]">
              Grow Your Brand, <br />
              <span className="italic text-teal-600 dark:text-teal-400">Optimized</span> by WebMagpie.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              WebMagpie is a premium full-service digital agency delivering expert full-stack web development, organic search optimization (SEO), and high-performance ad campaigns.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onBookClick}
                className="px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-teal-600/15 hover:shadow-teal-600/25 cursor-pointer transition-all duration-200"
              >
                Book Discovery Session
              </button>
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('departments')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-sm font-bold cursor-pointer transition-all duration-200"
              >
                Our Agency Core Services
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-6 border-t border-slate-100 dark:border-slate-800 max-w-xl">
              <div className="flex items-center gap-2">
                <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">4.9 / 5.0</span>
                <span className="text-xs text-slate-500">Client Satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="w-4.5 h-4.5 text-rose-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">100% Quality Code</span>
                <span className="text-xs text-slate-500">Industry Best Practices</span>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer frame */}
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600"
                  alt="Web Development Agency Team at WebMagpie"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating element 1 */}
              <div className="absolute left-2 sm:-left-6 top-1/4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '6s' }}>
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <Sparkles className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Active Specialists</p>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">6+ Lead Consultants</p>
                </div>
              </div>

              {/* Floating element 2 */}
              <div className="absolute right-2 sm:-right-6 bottom-10 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <Code className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Completed Projects</p>
                  <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">500+ Built & Optimized</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
