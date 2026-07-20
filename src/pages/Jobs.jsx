import React, { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { useJobStore } from '../store/jobStore';
import { KanbanBoard } from '../components/jobs/KanbanBoard';
import { JobList } from '../components/jobs/JobList';
import { JobModal } from '../components/jobs/JobModal';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';
import { Button } from '../components/common/Button';
import { Plus, LayoutGrid, List, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const Jobs = () => {
  const { user } = useAuthStore();
  const { jobs, loading, fetchJobs } = useJobStore();

  // View state: 'kanban' or 'list'
  const [view, setView] = useState('kanban');

  // Search/Filter/Sort state
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (user?.uid) {
      fetchJobs(user.uid);
    }
  }, [user?.uid, fetchJobs]);

  // Handle opening for new job creation
  const handleAddJobClick = () => {
    setJobToEdit(null);
    setIsModalOpen(true);
  };

  // Handle opening details
  const handleCardClick = (job) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  // Handle opening edit
  const handleEditClick = (job) => {
    setJobToEdit(job);
    setIsModalOpen(true);
  };

  // Filter and Sort implementation
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // 1. Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (job) =>
          job.company?.toLowerCase().includes(q) ||
          job.position?.toLowerCase().includes(q)
      );
    }

    // 2. Location filter
    if (locationFilter !== 'All') {
      result = result.filter((job) => job.location === locationFilter);
    }

    // 3. Status filter (only applies to List view)
    if (view === 'list' && statusFilter !== 'All') {
      result = result.filter(
        (job) => job.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // 4. Sorting logic
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.appliedDate) - new Date(a.appliedDate);
      }
      if (sortBy === 'oldest') {
        return new Date(a.appliedDate) - new Date(b.appliedDate);
      }
      if (sortBy === 'company-asc') {
        return (a.company || '').localeCompare(b.company || '');
      }
      if (sortBy === 'company-desc') {
        return (b.company || '').localeCompare(a.company || '');
      }
      if (sortBy === 'salary-desc') {
        const salA = parseFloat((a.salary || '').replace(/[^0-9.]/g, '')) || 0;
        const salB = parseFloat((b.salary || '').replace(/[^0-9.]/g, '')) || 0;
        return salB - salA;
      }
      if (sortBy === 'salary-asc') {
        const salA = parseFloat((a.salary || '').replace(/[^0-9.]/g, '')) || 0;
        const salB = parseFloat((b.salary || '').replace(/[^0-9.]/g, '')) || 0;
        return salA - salB;
      }
      return 0;
    });

    return result;
  }, [jobs, search, locationFilter, statusFilter, sortBy, view]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full flex flex-col gap-6 transition-colors duration-200">
      
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Job Applications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Track and manage your interviews, offers, and active job searches.
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={handleAddJobClick}
          className="gap-1.5 shadow-sm cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Application
        </Button>
      </div>

      {/* Control Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-2xs items-stretch md:items-center">
        
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-md text-sm text-slate-900 dark:text-white placeholder-slate-405 focus:outline-hidden focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Location Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="All">All Locations</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          {/* Status Filter (List-only) */}
          {view === 'list' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
              >
                <option value="All">All Statuses</option>
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="HR Round">HR Round</option>
                <option value="Technical">Technical</option>
                <option value="Assignment">Assignment</option>
                <option value="Final">Final</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          )}

          {/* Sorter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="newest">Applied: Newest</option>
              <option value="oldest">Applied: Oldest</option>
              <option value="company-asc">Company: A-Z</option>
              <option value="company-desc">Company: Z-A</option>
              <option value="salary-desc">Salary: High to Low</option>
              <option value="salary-asc">Salary: Low to High</option>
            </select>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          {/* View Toggles */}
          <div className="flex border border-slate-300 dark:border-slate-800 rounded-md overflow-hidden bg-slate-50 dark:bg-slate-950 p-0.5">
            <button
              onClick={() => setView('kanban')}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                view === 'kanban' 
                  ? 'bg-white dark:bg-slate-800 text-brand-650 dark:text-brand-400 shadow-2xs' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-250'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                view === 'list' 
                  ? 'bg-white dark:bg-slate-800 text-brand-650 dark:text-brand-400 shadow-2xs' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-250'
              }`}
              title="List Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      {loading && jobs.length === 0 ? (
        <div className="flex-grow flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-7 w-7 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Loading applications...</span>
          </div>
        </div>
      ) : (
        <div className="w-full">
          {view === 'kanban' ? (
            <KanbanBoard 
              jobs={filteredAndSortedJobs} 
              onCardClick={handleCardClick} 
            />
          ) : (
            <JobList 
              jobs={filteredAndSortedJobs} 
              onCardClick={handleCardClick} 
              onEditClick={handleEditClick} 
              onDeleteSuccess={(company) => setToast({ type: 'success', message: `Application for ${company} deleted successfully.` })}
              onDeleteError={(err) => setToast({ type: 'error', message: err.message || 'Failed to delete application.' })}
            />
          )}
        </div>
      )}

      {/* Modals integration */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setJobToEdit(null);
        }}
        jobToEdit={jobToEdit}
      />

      <JobDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        onEdit={handleEditClick}
        onDeleteSuccess={(company) => setToast({ type: 'success', message: `Application for ${company} deleted successfully.` })}
        onDeleteError={(err) => setToast({ type: 'error', message: err.message || 'Failed to delete application.' })}
      />

      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed bottom-5 right-5 flex items-center gap-2.5 px-4 py-3 rounded-lg border shadow-lg z-50 animate-in slide-in-from-bottom-5 duration-350
            ${toast.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-955/90 dark:text-emerald-350 border-emerald-200 dark:border-emerald-900/50' 
              : 'bg-red-50 dark:bg-red-955/90 text-red-800 dark:text-red-350 border-red-200 dark:border-red-900/50'
            }`}
        >
          {toast.type === 'success' ? (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white font-bold text-xs">!</div>
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

    </div>
  );
};
