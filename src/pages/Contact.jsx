import React, { useState } from 'react';
import { Mail, Github, Linkedin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setLoading(true);
    // Simulate API submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 sm:py-24 transition-colors duration-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-widest bg-brand-50 dark:bg-brand-950/30 px-3 py-1 rounded-full border border-brand-100 dark:border-brand-900/50">
            Contact Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-4">
            How can we help you?
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Have a question, feedback, or need technical support? Send us a message and our team will get back to you as soon as possible.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800">
                Contact Details
              </h3>
              
              <div className="flex gap-4 items-start">
                <div className="h-9 w-9 rounded-md bg-brand-50 dark:bg-brand-950/20 flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Email Us</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">support@trackhire.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-9 w-9 rounded-md bg-brand-50 dark:bg-brand-950/20 flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0">
                  <MessageSquare className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Community & FAQ</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Visit our FAQ below for quick troubleshooting.</p>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800">
                Follow TrackHire
              </h3>
              
              <div className="flex flex-col gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xs text-slate-650 hover:text-brand-600 dark:text-slate-350 dark:hover:text-brand-405 group transition-colors"
                >
                  <Github className="h-4.5 w-4.5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                  <span>GitHub Repository</span>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xs text-slate-650 hover:text-brand-600 dark:text-slate-350 dark:hover:text-brand-405 group transition-colors"
                >
                  <Linkedin className="h-4.5 w-4.5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-10 flex flex-col items-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/20 mb-4 border border-emerald-100 dark:border-emerald-900/50">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-405" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Message sent successfully!</h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Thank you for reaching out. We will review your message and reply within 24 hours.
                </p>
                <Button variant="outline" size="sm" className="mt-6 text-xs cursor-pointer" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jane Doe"
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 focus-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. jane@example.com"
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 focus-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Feature request / Support issue"
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 focus-ring"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Message *</label>
                  <textarea
                    rows="5"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe how we can support you..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 focus-ring resize-none"
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full justify-center text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
                >
                  {loading ? 'Submitting...' : 'Send Message'}
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
