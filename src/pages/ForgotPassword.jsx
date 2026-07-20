import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address')
});

export const ForgotPassword = () => {
  const { resetPassword, loading, error } = useAuthStore();
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' }
  });

  const onSubmit = async (data) => {
    try {
      await resetPassword(data.email);
      setSuccess(true);
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 sm:py-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <Link to="/" className="flex items-center gap-2.5 group mb-3">
            <Logo className="h-7 w-7 text-slate-900 dark:text-white transition-transform duration-200 group-hover:scale-105" />
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              TrackHire
            </span>
          </Link>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">Reset your password</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 text-center px-6">
            We will send a password reset link to your email address.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-xs">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/20 mb-4">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-405" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Reset email sent</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Please check your inbox for instructions on resetting your password.
              </p>
              <Link to="/login" className="mt-6 block">
                <Button variant="secondary" className="w-full cursor-pointer">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-955/20 border border-red-100 dark:border-red-900/50 p-3.5 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
                  <svg className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                error={errors.email?.message}
                placeholder="you@example.com"
                required
                {...register('email')}
              />

              <Button
                type="submit"
                className="w-full cursor-pointer"
                isLoading={loading}
              >
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          <Link to="/login" className="inline-flex items-center gap-1.5 font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
