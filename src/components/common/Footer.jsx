import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Logo } from './Logo';

export const Footer = () => {
  const { user } = useAuthStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-12 sm:mb-16">
          
          {/* Logo & Attribute Column */}
          <div className="col-span-2 flex flex-col gap-4">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group self-start">
              <Logo className="h-5.5 w-5.5 text-slate-900 dark:text-white transition-transform duration-200 group-hover:scale-105" />
              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                TrackHire
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Track and optimize your job search. Organize applications, optimize resumes, prepare for interviews, and manage your search from one modern dashboard.
            </p>
            <div className="text-[10px] text-slate-400 dark:text-slate-550 flex items-center gap-1.5 mt-2">
              <span>TrackHire &copy; {currentYear}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-0.5">
                Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by aman
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[11px] font-bold text-slate-905 dark:text-white uppercase tracking-wider">Product</h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400">
              <Link to="/#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Features</Link>
              <Link to={user ? "/dashboard" : "/login"} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Dashboard</Link>
              <Link to={user ? "/interview-prep" : "/login"} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Interview Preparation</Link>
              <Link to={user ? "/resume-analyzer" : "/login"} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Resume Analyzer</Link>
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[11px] font-bold text-slate-905 dark:text-white uppercase tracking-wider">Company</h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact Support</Link>
            </div>
          </div>

        </div>

        {/* Bottom Social Links Bar */}
        <div className="border-t border-slate-100 dark:border-slate-805 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-slate-450 dark:text-slate-500">
            A premium job tracking application. Designed for career builders.
          </p>
          <div className="flex items-center gap-4.5 text-slate-405 dark:text-slate-500">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="TrackHire GitHub"
              className="hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              <Github className="h-4.5 w-4.5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="TrackHire LinkedIn"
              className="hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              <Linkedin className="h-4.5 w-4.5" />
            </a>
            <a 
              href="mailto:support@trackhire.com"
              aria-label="TrackHire Email"
              className="hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              <Mail className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
