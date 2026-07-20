import React, { useState } from 'react';
import { JobCard } from './JobCard';
import { useJobStore } from '../../store/jobStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const COLUMNS = [
  { id: 'Wishlist', title: 'Wishlist', color: 'border-t-purple-500' },
  { id: 'Applied', title: 'Applied', color: 'border-t-amber-500' },
  { id: 'HR Round', title: 'HR Round', color: 'border-t-blue-400' },
  { id: 'Technical', title: 'Technical Board', color: 'border-t-blue-600' },
  { id: 'Assignment', title: 'Assignment', color: 'border-t-indigo-500' },
  { id: 'Final', title: 'Final Round', color: 'border-t-violet-600' },
  { id: 'Offer', title: 'Offers', color: 'border-t-emerald-500' },
  { id: 'Rejected', title: 'Rejected', color: 'border-t-rose-500' }
];

export const KanbanBoard = ({ jobs, onCardClick }) => {
  const { updateJob } = useJobStore();
  const [activeColumn, setActiveColumn] = useState(null);
  const [mobileView, setMobileView] = useState('kanban');
  const [activeMobileColumn, setActiveMobileColumn] = useState(0);

  const handleDragStart = (e, job) => {
    e.dataTransfer.setData('text/plain', job.id);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setActiveColumn(columnId);
  };

  const handleDragLeave = () => {
    setActiveColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setActiveColumn(null);
    const jobId = e.dataTransfer.getData('text/plain');
    if (!jobId) return;

    const job = jobs.find((j) => j.id === jobId);
    if (job && job.status !== targetStatus) {
      try {
        await updateJob(jobId, { status: targetStatus });
      } catch (err) {
        console.error('Failed to drag-and-drop update job status:', err);
      }
    }
  };

  // Kanban view for desktop/tablet
  const renderKanban = () => (
    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 w-full min-h-[calc(100vh-22rem)] items-start">
      {COLUMNS.map((column) => {
        const columnJobs = jobs.filter(
          (job) => job.status?.toLowerCase() === column.id.toLowerCase()
        );
        const isDraggingOver = activeColumn === column.id;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`flex-shrink-0 w-72 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 rounded-lg flex flex-col max-h-[calc(100vh-23rem)] transition-all duration-200 border-t-4 ${column.color} ${
              isDraggingOver ? 'bg-slate-100/70 dark:bg-slate-800/50 ring-1 ring-brand-500/20' : ''
            }`}
          >
            {/* Column Header */}
            <div className="px-4 py-3 border-b border-slate-200/60 dark:border-slate-800 flex justify-between items-center bg-slate-100/30 dark:bg-slate-950/20">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">
                {column.title}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-655 dark:text-slate-400 flex-shrink-0 ml-2">
                {columnJobs.length}
              </span>
            </div>

            {/* Cards List */}
            <div className="p-3 flex flex-col gap-3 overflow-y-auto min-h-[150px] flex-grow">
              {columnJobs.length === 0 ? (
                <div className="flex-grow flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-md p-6 text-center text-[10px] text-slate-400 dark:text-slate-500 font-semibold select-none">
                  No applications
                </div>
              ) : (
                columnJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onDragStart={handleDragStart}
                    onClick={onCardClick}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Mobile stacked view
  const renderMobileStack = () => (
    <div className="space-y-4 w-full">
      {COLUMNS.map((column) => {
        const columnJobs = jobs.filter(
          (job) => job.status?.toLowerCase() === column.id.toLowerCase()
        );
        
        return (
          <div key={column.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            {/* Collapsible Column Header */}
            <button
              onClick={() => setActiveMobileColumn(prev => prev === column.id ? null : column.id)}
              className="w-full px-4 py-3 border-b border-slate-200/60 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/30 text-left transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              aria-expanded={activeMobileColumn === column.id}
            >
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${column.color.replace('border-t-', 'bg-')}`} />
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {column.title}
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-655 dark:text-slate-400">
                  {columnJobs.length}
                </span>
              </div>
              <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${activeMobileColumn === column.id ? 'rotate-90' : ''}`} />
            </button>

            {/* Cards List - collapsible on mobile */}
            {activeMobileColumn === column.id && (
              <div className="p-3 space-y-3 max-h-[60vh] overflow-y-auto">
                {columnJobs.length === 0 ? (
                  <div className="flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-md p-6 text-center text-sm text-slate-400 dark:text-slate-500 font-medium">
                    No applications
                  </div>
                ) : (
                  columnJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onDragStart={handleDragStart}
                      onClick={onCardClick}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full">
      {/* Mobile view toggle */}
      <div className="flex items-center justify-between mb-4 lg:hidden gap-2">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">View:</h3>
        <div className="flex border border-slate-300 dark:border-slate-800 rounded-md overflow-hidden bg-slate-50 dark:bg-slate-950 p-0.5">
          <button
            onClick={() => setMobileView('kanban')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
              mobileView === 'kanban' 
                ? 'bg-white dark:bg-slate-800 text-brand-650 dark:text-brand-400 shadow-2xs' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-250'
            }`}
          >
            Board
          </button>
          <button
            onClick={() => setMobileView('stack')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
              mobileView === 'stack' 
                ? 'bg-white dark:bg-slate-800 text-brand-650 dark:text-brand-400 shadow-2xs' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-250'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {mobileView === 'kanban' ? renderKanban() : renderMobileStack()}
    </div>
  );
};
