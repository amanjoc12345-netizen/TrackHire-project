import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

export const Register = () => {
  const { register: signUp, loginWithGoogle, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  });

  const onSubmit = async (data) => {
    try {
      await signUp(data.email, data.password, data.name);
      navigate('/dashboard');
    } catch (err) {
      // Error handled by store
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 sm:py-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <Link to="/" className="flex items-center gap-2.5 group mb-3">
            <Logo className="h-7 w-7 text-slate-900 dark:text-white transition-transform duration-200 group-hover:scale-105" />
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              TrackHire
            </span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight text-center">Create your account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 text-center">Get started with TrackHire today.</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm">
          {error && (
            <div className="mb-5 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-3.5 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
              <svg className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1 min-w-0">
                <span className="font-semibold block mb-0.5">Registration Error</span>
                <span>{error}</span>
              </div>
              <button onClick={clearError} className="text-red-405 dark:text-red-400 hover:text-red-650 dark:hover:text-red-300 cursor-pointer border-none bg-transparent text-sm flex-shrink-0">&times;</button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              error={errors.name?.message}
              placeholder="Alex Johnson"
              required
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              error={errors.email?.message}
              placeholder="alex@example.com"
              required
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              required
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              error={errors.confirmPassword?.message}
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              required
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              className="w-full mt-1 sm:mt-2"
              isLoading={loading}
            >
              Sign Up
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-5 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">Or sign up with</span>
            </div>
          </div>

          {/* Social Sign Up */}
          <Button
            variant="outline"
            className="w-full gap-2 text-slate-705 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-750 cursor-pointer"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M21.35,11.1H12v2.7h5.38C17.15,14.9,15.65,16,14.02,16.52c-0.62,0.2-1.28,0.3-1.92,0.3c-2.83,0-5.18-1.92-6.03-4.51c-0.22-0.67-0.35-1.37-0.35-2.11c0-0.74,0.13-1.44,0.35-2.11c0.85-2.59,3.2-4.51,6.03-4.51c1.62,0,3.06,0.61,4.15,1.61l2.06-2.06C16.8,1.86,14.54,1,12.1,1C7.24,1,3.2,4.45,2.1,9.02c-0.28,0.88-0.45,1.8-0.45,2.78c0,0.98,0.17,1.9,0.45,2.78C3.2,19.15,7.24,22.6,12.1,22.6c3.15,0,5.81-1.04,7.74-2.85c1.92-1.8,3.01-4.46,3.01-7.55C22.85,11.75,22.6,11.1,21.35,11.1z" fill="#4285F4"/>
              </g>
            </svg>
            Sign up with Google
          </Button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-5 sm:mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
