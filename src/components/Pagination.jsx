import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, isAdmin = false }) => {
    if (totalPages <= 1) return null;

    // Helper to get page numbers to display (with ellipsis support)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            
            if (currentPage <= 2) {
                end = 3;
            } else if (currentPage >= totalPages - 1) {
                start = totalPages - 2;
            }
            
            if (start > 2) pages.push('...');
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (end < totalPages - 1) pages.push('...');
            
            pages.push(totalPages);
        }
        
        return pages;
    };

    const hoverClass = isAdmin 
        ? 'hover:bg-amber-50 hover:text-amber-700' 
        : 'hover:bg-indigo-50 hover:text-indigo-600';

    const activeClass = isAdmin 
        ? 'bg-amber-500 text-black shadow-md' 
        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md';

    const inactiveClass = isAdmin
        ? 'bg-white border border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
        : 'bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600';

    return (
        <div className="flex items-center justify-center gap-2 pt-8 pb-4 select-none">
            {/* Prev Button */}
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 transition-all shadow-sm hover:shadow active:scale-95 ${hoverClass}`}
            >
                <ChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1.5">
                {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-2 text-slate-400 font-bold">
                                ...
                            </span>
                        );
                    }
                    
                    const isActive = page === currentPage;
                    return (
                        <button
                            type="button"
                            key={`page-${page}`}
                            onClick={() => onPageChange(page)}
                            className={`h-10 min-w-10 px-3.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 ${isActive ? activeClass : inactiveClass}`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 transition-all shadow-sm hover:shadow active:scale-95 ${hoverClass}`}
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default Pagination;
