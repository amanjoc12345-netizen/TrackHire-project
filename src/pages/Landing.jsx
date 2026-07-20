import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Sparkles, 
  FileText, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle,
  Plus,
  Minus,
  Star,
  Quote,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const Landing = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "What is TrackHire?",
      a: "TrackHire is a modern, high-performance job search CRM and optimization toolkit. It helps you centralize job applications, analyze and optimize resumes using AI, draft tailored cover letters, and simulate interviews on a clean, unified dashboard."
    },
    {
      q: "Is my personal data and resumes secure?",
      a: "Absolutely. Security and data privacy are core design values. All resumes, profile info, and application logs are sandboxed and protected under secure Firebase security rules, accessible only by you."
    },
    {
      q: "How does the AI Resume Analyzer operate?",
      a: "Our system extracts text from your uploaded docx/pdf resume and cross-references it against a job description. It runs semantic comparisons to calculate matching scores, locate keyword gaps, and supply exact, actionable optimization ideas."
    },
    {
      q: "Can I export my job data?",
      a: "Yes. We support complete data portability. You can export your entire portfolio, resume details, and history logs into a standard JSON file, or permanently erase your database records at any time from your settings panel."
    },
    {
      q: "Is TrackHire free to use?",
      a: "TrackHire is currently in public beta and is completely free of charge. You can access all tracking features, AI analyzers, and interview preparation tools without limits."
    }
  ];


  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-850 dark:text-slate-200 text-xs font-semibold mb-6 transition-all duration-200">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span>TrackHire is now in public beta</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Track and optimize your <span className="text-brand-600 dark:text-brand-450">job search with TrackHire.</span>
            </h1>
            
            <p className="mt-6 text-base sm:text-lg text-slate-650 dark:text-slate-400 max-w-2xl leading-relaxed">
              TrackHire helps you organize job applications, optimize resumes, prepare for interviews, and manage your job search from one modern dashboard.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="shadow-xs cursor-pointer bg-brand-600 hover:bg-brand-700 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100">
                  Get Started for Free <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="cursor-pointer">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Clean Mock UI Container */}
          <div className="mt-16 mx-auto max-w-5xl rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 shadow-xs">
            <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200/80 dark:border-slate-800/80 shadow-2xs overflow-hidden">
              {/* Mock window header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">trackhire.app/dashboard</div>
                <div className="w-12"></div>
              </div>
              
              {/* Mock Dashboard content */}
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-slate-200 dark:border-slate-850 rounded-lg p-5 bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/50">
                      Applied
                    </span>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">12 mins ago</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Frontend Developer</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-405 mt-1">Vercel &bull; Remote</p>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <span>$120k - $140k</span>
                    <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-0.5">View &rarr;</span>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-850 rounded-lg p-5 bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/50">
                      Interviewing
                    </span>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">Tomorrow, 2:00 PM</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">UI/UX Engineer</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-405 mt-1">Stripe &bull; Hybrid</p>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <span>$135k - $155k</span>
                    <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-0.5">Prep Now &rarr;</span>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-850 rounded-lg p-5 bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                      Offer Received
                    </span>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">2 days ago</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Senior React Developer</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-405 mt-1">Linear &bull; Remote</p>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <span>$160k - $180k</span>
                    <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-0.5">Negotiate &rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-wider">Features</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mt-1">
              Structured workspace for job applications
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Keep applications, resumes, and preparation notes in one organized, performant dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-brand-500 transition-custom hover:shadow-xs">
              <div className="h-10 w-10 rounded-md bg-brand-50 dark:bg-brand-950/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Job Tracker</h3>
              <p className="mt-2 text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                A clean Kanban board and list view to log active applications, interview steps, and offers.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-brand-500 transition-custom hover:shadow-xs">
              <div className="h-10 w-10 rounded-md bg-brand-50 dark:bg-brand-950/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Resume Analyzer</h3>
              <p className="mt-2 text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                Compare your resume to any job description. Find missing keywords and get detailed parsing feedback.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-brand-500 transition-custom hover:shadow-xs">
              <div className="h-10 w-10 rounded-md bg-brand-50 dark:bg-brand-950/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Cover Letter Writer</h3>
              <p className="mt-2 text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                Draft customized cover letters matching specific requirements from the target role to your profile details.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-brand-500 transition-custom hover:shadow-xs">
              <div className="h-10 w-10 rounded-md bg-brand-50 dark:bg-brand-950/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Interview Simulator</h3>
              <p className="mt-2 text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                Generate and review common technical and behavioral questions customized to target position structures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="ai" className="py-20 bg-white dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Contextual Language Tools
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mt-1">
              Resume and matching utilities
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Extract resume profiles and match them directly against the requirements of specific roles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 p-6 rounded-xl space-y-4">
              <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-450 flex items-center justify-center">
                <Target className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Keyword matching</h3>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                Locate missing skills and terms by comparing your resume text directly to the job post.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 p-6 rounded-xl space-y-4">
              <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Zap className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cover Letter Generation</h3>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                Automatically weave experiences from your resume together with core specifications requested by the employer into a clean, custom cover letter.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 p-6 rounded-xl space-y-4">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-405 flex items-center justify-center">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interview questions</h3>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                Generate and practice common interview questions customized for the target company and position details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Benefit Section */}
      <section id="why" className="py-20 bg-slate-50 dark:bg-slate-950 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-wider">Why TrackHire</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mt-1">
                A single home for your search data.
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
                Manage files, contact history, and schedules without popups, dashboards, or clutter. We build utility-focused software.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-105 text-sm">Secure and Private</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your resumes and applications are protected with Firebase security rules.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-105 text-sm">Performance</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Fast page transitions and lightweight queries.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-405 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-105 text-sm">Standards-based code</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Built using clear modular React architecture and client-side processing.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200/80 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">Platform statistics</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Average match alignment rating</span>
                    <span className="text-brand-600 dark:text-brand-400">85% match alignment</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-600 dark:bg-brand-450 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Average preparation load reduction</span>
                    <span className="text-brand-600 dark:text-brand-400">70% reduction</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-600 dark:bg-brand-450 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Centralized document storage</span>
                    <span className="text-brand-600 dark:text-brand-400">100% centralized</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-600 dark:bg-brand-450 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="block text-2xl font-bold text-slate-900 dark:text-white">3 min</span>
                  <span className="text-xs text-slate-500 dark:text-slate-405">Average parsing time</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-slate-900 dark:text-white">99.9%</span>
                  <span className="text-xs text-slate-500 dark:text-slate-405">System uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-808 scroll-mt-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-wider">FAQ</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mt-1">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Clear answers to the most common queries about TrackHire, parsing records, and security.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between px-6 py-4.5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <Minus className="h-4 w-4 flex-shrink-0" /> : <Plus className="h-4 w-4 flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-850 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
