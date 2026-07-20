import React from 'react';

export const DashboardLayout = ({ header, stats, mainContent, sidebar }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-grow w-full flex flex-col gap-6 sm:gap-8 transition-colors duration-200">
      {/* Header Slot */}
      {header && <div>{header}</div>}

      {/* Stats Slot - responsive grid */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats}
        </div>
      )}

      {/* Main content area - stacks on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main Column - full width on mobile, 2/3 on desktop */}
        <div className="flex-1 min-w-0 lg:min-w-0 flex flex-col gap-6 lg:gap-8">
          {mainContent}
        </div>

        {/* Sidebar Column - full width on mobile (below main), 1/3 on desktop */}
        {sidebar && (
          <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6 lg:gap-8 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2">
            {sidebar}
          </div>
        )}
      </div>
    </div>
  );
};
