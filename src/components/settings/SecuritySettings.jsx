import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Shield, ShieldAlert, Key, LogOut, CheckCircle, Mail, Clock } from 'lucide-react';
import { Button } from '../common/Button';

export const SecuritySettings = () => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setNotification({ type: 'error', message: 'All password fields are required.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setNotification({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setNotification({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    setNotification(null);
    try {
      if (!currentUser) throw new Error("No authenticated user session.");
      await updatePassword(currentUser, newPassword);
      setNotification({ type: 'success', message: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setNotification({
          type: 'error',
          message: 'For security reasons, changing password requires a recent login. Please log out, log back in, and try again.'
        });
      } else {
        setNotification({ type: 'error', message: err.message || 'Failed to update password.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (_) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h3 className="text-base font-bold text-slate-855 dark:text-white">Security & Login</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your login credentials, password settings, and session controls.
        </p>
      </div>

      {notification && (
        <div 
          className={`flex items-start gap-2.5 px-4 py-3 rounded-lg border text-xs font-semibold
            ${notification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-955/90 dark:text-emerald-350 border-emerald-200 dark:border-emerald-900/50' 
              : 'bg-red-50 dark:bg-red-955/90 text-red-800 dark:text-red-350 border-red-200 dark:border-red-900/50'
            }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Security Status Card */}
      <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-205 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          <div>
            <span className="text-xs font-bold text-slate-850 dark:text-slate-200 block">Security Status</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              Your account is secure.
            </span>
          </div>
        </div>
      </div>

      {/* Login Credentials Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex gap-3 items-center">
          <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Login Email</span>
            <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold">{currentUser?.email || '—'}</span>
          </div>
        </div>
        <div className="flex gap-3 items-center border-t border-slate-100 dark:border-slate-850 pt-3">
          <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Active Session</span>
            <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold">
              {formatDate(currentUser?.metadata?.lastSignInTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordChange} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
          <Key className="h-4 w-4 text-brand-600 dark:text-brand-405" />
          Change Password
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="text-xs font-bold px-4 py-2 cursor-pointer shadow-xs"
          >
            Update Password
          </Button>
        </div>
      </form>

      {/* Logout Card */}
      <div className="bg-red-50/10 dark:bg-red-955/5 border border-red-200/40 dark:border-red-900/20 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <LogOut className="h-4 w-4" />
            Device Session Control
          </h4>
          <p className="text-2xs text-slate-450 dark:text-slate-500 mt-1 leading-normal">
            Terminates your current session and logs out of TrackHire on this browser.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="text-xs font-bold px-4 py-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-955/20 cursor-pointer"
        >
          Logout Session
        </Button>
      </div>

    </div>
  );
};
