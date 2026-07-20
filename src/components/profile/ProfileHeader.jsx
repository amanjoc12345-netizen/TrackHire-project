import React, { useRef, useState } from 'react';
import { Camera, MapPin, Mail, Loader2, Award } from 'lucide-react';
import { useProfileStore } from '../../store/profileStore';

export const ProfileHeader = ({ profile, uid }) => {
  const uploadAvatar = useProfileStore((state) => state.uploadAvatar);
  const saving = useProfileStore((state) => state.saving);
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG).');
      return;
    }

    setUploading(true);
    setError('');
    try {
      await uploadAvatar(uid, file);
    } catch (err) {
      setError(err.message || 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs transition-colors duration-200">
      {/* Banner Decor */}
      <div className="h-32 sm:h-40 bg-gradient-to-r from-brand-600 to-indigo-600 w-full"></div>
      
      {/* Profile Header Contents */}
      <div className="px-6 pb-6 pt-0 flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-12">
        {/* Avatar Container */}
        <div className="relative group h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-md flex-shrink-0 cursor-pointer" onClick={handleAvatarClick} aria-label="Upload profile photo">
          {profile?.photoURL ? (
            <img 
              src={profile.photoURL} 
              alt={profile.fullName || 'Profile avatar'} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-400 dark:text-slate-500">
              <span className="text-3xl font-bold uppercase">
                {profile?.fullName?.charAt(0) || '?'}
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white">
            <Camera className="h-6 w-6 mb-1" />
            <span className="text-2xs font-medium">Change Photo</span>
          </div>

          {/* Uploading State overlay */}
          {(uploading || saving) && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
              <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
            </div>
          )}

          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Info Block */}
        <div className="flex-grow text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                {profile?.fullName || 'Your Name'}
                {profile?.currentRole && (
                  <span className="hidden sm:inline-flex items-center rounded-full bg-brand-50 dark:bg-brand-950/30 px-2 py-0.5 text-xs font-medium text-brand-700 dark:text-brand-400 border border-brand-100/50 dark:border-brand-900/30">
                    <Award className="h-3 w-3 mr-1" /> Verified Profile
                  </span>
                )}
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {profile?.headline || 'No professional headline set'}
              </p>
            </div>
          </div>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2.5 text-xs text-slate-550 dark:text-slate-405">
            {profile?.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {profile.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              {profile?.email || 'No email connected'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 mb-4 px-4 py-2 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 text-xs rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};
