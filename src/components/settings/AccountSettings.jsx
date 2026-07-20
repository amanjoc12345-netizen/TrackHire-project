import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const AccountSettings = ({ profile }) => {
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-16 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h3 className="text-base font-bold text-slate-855 dark:text-white">Account Details</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review your account profile status synchronized from Firestore.
        </p>
      </div>

      <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row gap-5 items-center">
        {profile.photoURL ? (
          <img 
            src={profile.photoURL} 
            alt={profile.fullName} 
            className="h-16 w-16 rounded-full border border-slate-205 dark:border-slate-700 object-cover shadow-3xs"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-405 border border-brand-100/50 dark:border-brand-900/30 flex items-center justify-center shadow-3xs">
            <User className="h-8 w-8" />
          </div>
        )}
        <div className="text-center sm:text-left min-w-0">
          <h4 className="text-sm font-bold text-slate-850 dark:text-white truncate">
            {profile.fullName || 'User Account'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {profile.currentRole || 'TrackHire Member'}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 divide-y divide-slate-100 dark:divide-slate-850 space-y-4">
        <div className="flex gap-3 items-center py-1">
          <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
            <span className="text-xs text-slate-800 dark:text-slate-200 truncate block">{profile.email || '—'}</span>
          </div>
        </div>
        <div className="flex gap-3 items-center pt-3 py-1">
          <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
            <span className="text-xs text-slate-800 dark:text-slate-200 truncate block">{profile.phoneNumber || '—'}</span>
          </div>
        </div>
        <div className="flex gap-3 items-center pt-3 py-1">
          <Briefcase className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Role</span>
            <span className="text-xs text-slate-800 dark:text-slate-200 truncate block">{profile.currentRole || '—'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          variant="primary"
          onClick={() => navigate('/profile')}
          className="text-xs font-bold px-4 py-2 cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          Edit Profile
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/profile')}
          className="text-xs font-semibold px-4 py-2 cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850"
        >
          Go to Profile
        </Button>
      </div>
    </div>
  );
};
