import React from 'react';

const PageHeader = ({ title, subtitle, icon: Icon, actions, forceRow = false }) => {
    return (
        <div className={`relative overflow-hidden bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90 backdrop-blur-3xl rounded-xl border border-white/40 shadow-xl shadow-purple-500/20 px-4 py-4 flex ${forceRow ? 'flex-row items-center' : 'flex-col md:flex-row items-start md:items-center'} md:rounded-2xl md:px-8 md:py-6 justify-between gap-3 md:gap-4 group`}>

            {/* Mirror/Glossy light reflections */}
            {/* Top highlight */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/5 to-transparent h-[45%] pointer-events-none"></div>

            {/* Diagonal glass cut */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/20 via-transparent to-transparent pointer-events-none transform translate-x-1/3 -skew-x-12"></div>

            {/* Ambient glows */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-400/40 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-300/50 transition-all duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400/40 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-300/50 transition-all duration-700"></div>

            <div className="relative z-10 flex items-center gap-3 md:gap-5 w-full min-w-0">
                {Icon && (
                    <div className="p-2.5 md:p-3.5 bg-white/20 backdrop-blur-xl border border-white/50 text-white rounded-lg md:rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 md:w-[26px] md:h-[26px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" strokeWidth={2.5} />
                    </div>
                )}
                <div className="flex flex-col min-w-0">
                    <h1 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-purple-100 tracking-tight drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xs md:text-sm text-white/95 font-bold mt-0.5 line-clamp-2 md:line-clamp-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            {actions && (
                <div className={`relative z-10 flex flex-wrap items-center gap-2 md:gap-3 shrink-0 ${forceRow ? 'w-auto' : 'w-full md:w-auto'} [&_button]:text-xs md:[&_button]:text-sm [&_button]:px-3 [&_button]:py-2 md:[&_button]:px-4 md:[&_button]:py-2.5`}>
                    {actions}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
