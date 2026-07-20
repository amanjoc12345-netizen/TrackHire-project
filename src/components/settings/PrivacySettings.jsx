import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../../firebase/config';
import { ShieldAlert, Download, Trash2, CheckCircle, ShieldCheck, Calendar } from 'lucide-react';
import { Button } from '../common/Button';

export const PrivacySettings = ({ uid, profile }) => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  const [notification, setNotification] = useState(null);

  const handleDownloadData = async () => {
    setDownloading(true);
    setNotification(null);
    try {
      // 1. Fetch profile
      const profileDoc = await getDoc(doc(db, 'users', uid));
      const profileData = profileDoc.exists() ? profileDoc.data() : null;

      // 2. Fetch saved resumes
      const resumesSnapshot = await getDocs(collection(db, 'users', uid, 'generatedResumes'));
      const resumesData = [];
      resumesSnapshot.forEach((d) => resumesData.push({ id: d.id, ...d.data() }));

      // 3. Fetch jobs
      const jobsSnapshot = await getDocs(query(collection(db, 'jobs'), where('userId', '==', uid)));
      const jobsData = [];
      jobsSnapshot.forEach((d) => jobsData.push({ id: d.id, ...d.data() }));

      // 4. Fetch analysis history
      const historySnapshot = await getDocs(query(collection(db, 'analysisHistory'), where('userId', '==', uid)));
      const historyData = [];
      historySnapshot.forEach((d) => historyData.push({ id: d.id, ...d.data() }));

      const fullBackup = {
        exportedAt: new Date().toISOString(),
        userId: uid,
        profile: profileData,
        savedResumes: resumesData,
        jobApplications: jobsData,
        analysisHistory: historyData
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `trackhire_data_export_${uid}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setNotification({ type: 'success', message: 'Data backup exported successfully!' });
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to compile data export.' });
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleting(true);
    setNotification(null);
    try {
      if (!currentUser) throw new Error("No active user session found.");

      // 1. Delete generated resumes
      const resumesSnapshot = await getDocs(collection(db, 'users', uid, 'generatedResumes'));
      for (const d of resumesSnapshot.docs) {
        await deleteDoc(doc(db, 'users', uid, 'generatedResumes', d.id));
      }

      // 2. Delete jobs
      const jobsSnapshot = await getDocs(query(collection(db, 'jobs'), where('userId', '==', uid)));
      for (const d of jobsSnapshot.docs) {
        await deleteDoc(doc(db, 'jobs', d.id));
      }

      // 3. Delete analysis history
      const historySnapshot = await getDocs(query(collection(db, 'analysisHistory'), where('userId', '==', uid)));
      for (const d of historySnapshot.docs) {
        await deleteDoc(doc(db, 'analysisHistory', d.id));
      }

      // 4. Delete profile storage avatar / resume files
      if (profile?.photoURL && profile.photoURL.includes('firebasestorage')) {
        try {
          await deleteObject(ref(storage, profile.photoURL));
        } catch (_) {}
      }
      if (profile?.resume?.url && profile.resume.url.includes('firebasestorage')) {
        try {
          await deleteObject(ref(storage, profile.resume.url));
        } catch (_) {}
      }

      // 5. Delete Firestore User Document
      await deleteDoc(doc(db, 'users', uid));

      // 6. Delete Authentication User
      await deleteUser(currentUser);

      // Clean redirect to login
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setNotification({
          type: 'error',
          message: 'Deleting your account requires a recent sign-in. Please log out, sign back in, and try again.'
        });
      } else {
        setNotification({ type: 'error', message: err.message || 'Account deletion failed.' });
      }
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (_) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h3 className="text-base font-bold text-slate-855 dark:text-white">Privacy & User Data</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review your account lifecycle parameters and manage exports.
        </p>
      </div>

      {notification && (
        <div 
          className={`flex items-start gap-2.5 px-4 py-3 rounded-lg border text-xs font-semibold
            ${notification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-955/90 dark:text-emerald-355 border-emerald-200 dark:border-emerald-900/50' 
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

      {/* Account Creation details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex gap-3 items-center">
          <ShieldCheck className="h-4 w-4 text-brand-600 dark:text-brand-405 flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Verification Status</span>
            <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold">
              {currentUser?.emailVerified ? 'Verified Account' : 'Unverified Email Address'}
            </span>
          </div>
        </div>
        <div className="flex gap-3 items-center border-t border-slate-100 dark:border-slate-850 pt-3">
          <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Registration Date</span>
            <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold">
              {formatDate(currentUser?.metadata?.creationTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Export Data */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">Download Data Backup</h4>
          <p className="text-2xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
            Export a full copy of your profile credentials, saved resume drafts, analytics history, and job applications list formatted in JSON.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleDownloadData}
          isLoading={downloading}
          className="text-xs font-bold px-4 py-2 border-slate-250 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850 cursor-pointer shadow-3xs flex items-center gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          Download JSON Export
        </Button>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="bg-red-50/10 dark:bg-red-955/5 border border-red-200/40 dark:border-red-900/20 rounded-xl p-5 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-red-655 dark:text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
            Danger Zone
          </h4>
          <p className="text-2xs text-slate-500 dark:text-slate-450 mt-1 leading-normal">
            Permanently delete your user profile, saved drafts, analysis documents, storage assets, and authentication credentials. This action is absolute and irreversible.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setDeleteConfirmText('');
            setShowDeleteModal(true);
          }}
          className="text-xs font-bold px-4 py-2 border-red-200 text-red-650 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-955/20 cursor-pointer"
        >
          Delete My Account
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-955/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl max-w-sm w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h3 className="text-sm font-bold text-red-600 dark:text-red-405 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
              <ShieldAlert className="h-4.5 w-4.5" />
              Confirm Account Deletion
            </h3>
            <p className="text-2xs text-slate-500 dark:text-slate-400 mb-4 leading-normal">
              This will permanently wipe all your profile details, jobs, analysis files, and resumes. Type <strong className="text-red-500">DELETE</strong> in the field below to confirm this action.
            </p>

            <input
              type="text"
              placeholder="Type DELETE here..."
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-red-500 mb-4 text-center tracking-widest"
            />

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <Button
                variant="primary"
                onClick={handleDeleteAccount}
                isLoading={deleting}
                disabled={deleteConfirmText !== 'DELETE' || deleting}
                className="text-xs font-bold px-4 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
