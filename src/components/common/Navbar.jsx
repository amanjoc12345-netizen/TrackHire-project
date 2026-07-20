import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { Button } from './Button';
import { Logo } from './Logo';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Define dynamic links based on user authentication state
  const navLinks = user 
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Jobs', path: '/jobs' },
        { name: 'Interview Prep', path: '/interview-prep' },
        { name: 'Resume Analyzer', path: '/resume-analyzer' },
        { name: 'Profile', path: '/profile' },
        { name: 'Settings', path: '/settings' },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Features', path: '/#features' },
        { name: 'Why TrackHire', path: '/#why' },
        { name: 'FAQ', path: '/#faq' },
      ];

  return (
    <nav className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
      (isScrolled || isOpen) 
        ? 'border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm' 
        : 'border-transparent bg-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group flex-shrink-0">
              <Logo className="h-5.5 w-5.5 text-slate-900 dark:text-white transition-transform duration-200 group-hover:scale-105" />
              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                TrackHire
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-custom hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 ${
                    isActive(link.path) 
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20' 
                      : 'text-slate-600 dark:text-slate-350'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex md:items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-ring"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden lg:inline-block">
                    {user.displayName || 'Account'}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout} 
                  className="text-slate-650 dark:text-slate-305 hover:text-red-650 hover:dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 cursor-pointer border-none bg-transparent gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions block */}
          <div className="flex items-center gap-1.5 md:hidden">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-ring"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 cursor-pointer"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer/Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 w-full border-t border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2 shadow-lg transition-all duration-200 animate-in slide-in-from-top-2 z-50">
          <nav className="space-y-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-base font-medium transition-custom ${
                  isActive(link.path) 
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/30' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-4">
            {user ? (
              <div className="space-y-3 px-2">
                <div className="flex items-center gap-3 px-2 py-1">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-850 dark:text-slate-200 truncate">{user.displayName || 'User'}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full justify-start text-slate-600 dark:text-slate-300 hover:text-red-650 hover:dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 border-slate-300 dark:border-slate-700 cursor-pointer gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="outline" size="md" className="w-full justify-center">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="primary" size="md" className="w-full justify-center">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};
