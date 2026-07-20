import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useJobStore } from '../store/jobStore';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentApplications } from '../components/dashboard/RecentApplications';
import { UpcomingInterviews } from '../components/dashboard/UpcomingInterviews';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { Notifications } from '../components/dashboard/Notifications';
import { EmptyState } from '../components/dashboard/EmptyState';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { jobs, loading, fetchJobs } = useJobStore();

  useEffect(() => {
    if (user?.uid) {
      fetchJobs(user.uid);
    }
  }, [user?.uid, fetchJobs]);

  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  // Calculate dynamic stats from Firestore/local jobs state
  const totalApps = jobs.length;
  const offersCount = jobs.filter(j => j.status?.toLowerCase() === 'offer').length;
  const rejectedCount = jobs.filter(j => j.status?.toLowerCase() === 'rejected').length;

  // Find nearest upcoming interview in the future or today
  const getNearestInterview = (jobsList) => {
    const interviewJobs = jobsList.filter(job => 
      ['hr round', 'technical', 'assignment', 'final'].includes(job.status?.toLowerCase()) && 
      job.interviewDate
    );
    
    if (interviewJobs.length === 0) return null;
    
    const sorted = [...interviewJobs].sort((a, b) => {
      const dateTimeA = new Date(`${a.interviewDate}T${a.interviewTime || '00:00'}`);
      const dateTimeB = new Date(`${b.interviewDate}T${b.interviewTime || '00:00'}`);
      return dateTimeA - dateTimeB;
    });
    
    return sorted[0];
  };

  const nearest = getNearestInterview(jobs);
  const interviewsValue = nearest ? nearest.company : 'None';
  const interviewsSubtext = nearest 
    ? `${nearest.status}: ${new Date(nearest.interviewDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` 
    : '0 active interviews';

  const header = (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Welcome back, {userName}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
        Here is an overview of your job search progress.
      </p>
    </div>
  );

  const stats = (
    <>
      <Link to="/jobs/applications" className="block hover:no-underline cursor-pointer group">
        <StatCard 
          name="Applications" 
          value={totalApps} 
          change={totalApps > 0 ? `${totalApps} total active` : 'No applications yet'} 
          icon={Briefcase} 
          color="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 group-hover:scale-[1.02] transition-transform" 
        />
      </Link>
      <Link to="/jobs/interviews" className="block hover:no-underline cursor-pointer group">
        <StatCard 
          name="Interviews" 
          value={interviewsValue} 
          change={interviewsSubtext} 
          icon={Calendar} 
          color="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 group-hover:scale-[1.02] transition-transform" 
        />
      </Link>
      <Link to="/jobs/offers" className="block hover:no-underline cursor-pointer group">
        <StatCard 
          name="Offers" 
          value={offersCount} 
          change={`${offersCount} received`} 
          icon={CheckCircle2} 
          color="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 group-hover:scale-[1.02] transition-transform" 
        />
      </Link>
      <Link to="/jobs/rejected" className="block hover:no-underline cursor-pointer group">
        <StatCard 
          name="Archived" 
          value={rejectedCount} 
          change={`${rejectedCount} archived`} 
          icon={XCircle} 
          color="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 group-hover:scale-[1.02] transition-transform" 
        />
      </Link>
    </>
  );

  if (loading && jobs.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      header={header}
      stats={stats}
      mainContent={
        jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <RecentApplications jobs={jobs} />
            <UpcomingInterviews jobs={jobs} />
          </>
        )
      }
      sidebar={
        <>
          <QuickActions />
          <Notifications jobs={jobs} />
          <RecentActivity jobs={jobs} />
        </>
      }
    />
  );
};
