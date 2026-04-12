import React from 'react';

/**
 * Positions admin modals above the sidebar (md+) and below the mobile header,
 * centered in that region. z-[100] clears AdminSidebar (z-50) stacking.
 */
export default function AdminModalShell({ children }) {
    return (
        <div className="fixed inset-x-0 bottom-0 left-0 top-16 z-[100] flex items-center justify-center p-2.5 sm:p-3 md:left-64 md:top-0 md:p-4 bg-zinc-900/45 backdrop-blur-sm">
            {children}
        </div>
    );
}
