import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Users, BookOpen, GraduationCap, Calendar, Activity, Save, Plus, DollarSign, Trash2, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';

const VB_W = 352;
const VB_H = 140;
const PAD_L = 38;
const PAD_R = 8;
const PAD_T = 10;
const PAD_B = 24;
const H_GRID_DIVS = 4;
const V_GRID_DIVS = 5;

/** Simple SVG area chart: cumulative users over the last 30 days (UTC buckets from API). */
function UserGrowthChart({ points }) {
    const totals = points.map((p) => Number(p.total) || 0);
    const n = totals.length;
    const last = n ? totals[n - 1] : 0;
    const first = n ? totals[0] : 0;
    const delta = last - first;
    const yMinRaw = n ? Math.min(...totals) : 0;
    const yMaxRaw = n ? Math.max(...totals) : 1;
    const span = yMaxRaw - yMinRaw || 1;
    const padY = Math.max(span * 0.12, 1);
    const yMin = yMinRaw - padY;
    const yMax = yMaxRaw + padY;
    const yRange = yMax - yMin || 1;

    const innerW = VB_W - PAD_L - PAD_R;
    const innerH = VB_H - PAD_T - PAD_B;

    let lineD = '';
    let areaD = '';
    if (n >= 2) {
        const coords = totals.map((t, i) => {
            const x = PAD_L + (i / (n - 1)) * innerW;
            const y = PAD_T + innerH - ((t - yMin) / yRange) * innerH;
            return { x, y };
        });
        lineD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
        const baseY = PAD_T + innerH;
        areaD = `${lineD} L ${coords[coords.length - 1].x.toFixed(1)} ${baseY} L ${coords[0].x.toFixed(1)} ${baseY} Z`;
    } else if (n === 1) {
        const x = PAD_L + innerW / 2;
        const y = PAD_T + innerH - ((totals[0] - yMin) / yRange) * innerH;
        lineD = `M ${PAD_L} ${y.toFixed(1)} L ${PAD_L + innerW} ${y.toFixed(1)}`;
        areaD = `M ${PAD_L} ${y.toFixed(1)} L ${PAD_L + innerW} ${y.toFixed(1)} L ${PAD_L + innerW} ${PAD_T + innerH} L ${PAD_L} ${PAD_T + innerH} Z`;
    }

    const labelStart = n ? new Date(`${points[0].day}T12:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
    const labelEnd = n ? new Date(`${points[n - 1].day}T12:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';

    const hGrid =
        n > 0
            ? Array.from({ length: H_GRID_DIVS + 1 }, (_, i) => {
                  const val = yMin + (i / H_GRID_DIVS) * (yMax - yMin);
                  const y = PAD_T + innerH - ((val - yMin) / yRange) * innerH;
                  return { val, y };
              })
            : [];

    const vGridXs =
        n > 0
            ? Array.from({ length: V_GRID_DIVS + 1 }, (_, i) => PAD_L + (i / V_GRID_DIVS) * innerW)
            : [];

    return (
        <section className="relative w-full bg-zinc-100 rounded-[2rem] border border-zinc-200 overflow-hidden shadow-sm flex flex-col min-h-[min(60vh,480px)] lg:min-h-0">
            <div className="px-5 py-4 border-b border-zinc-200 bg-zinc-50 shrink-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-sky-500/15 text-sky-700 shrink-0">
                            <TrendingUp size={20} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg font-black text-zinc-900 tracking-tight">User growth</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-center px-4 py-4 min-h-[200px]">
                {n === 0 && (
                    <p className="text-center text-sm font-semibold text-zinc-500 py-8">No growth data yet.</p>
                )}
                {n > 0 && (
                    <div className="relative w-full">
                        <svg
                            viewBox={`0 0 ${VB_W} ${VB_H}`}
                            className="w-full h-auto max-h-[220px] drop-shadow-[0_0_24px_rgba(56,189,248,0.12)]"
                            preserveAspectRatio="xMidYMid meet"
                            role="img"
                            aria-label="Cumulative users over the last 30 days"
                        >
                            <defs>
                                <linearGradient id="userGrowthFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(56, 189, 248)" stopOpacity="0.45" />
                                    <stop offset="100%" stopColor="rgb(56, 189, 248)" stopOpacity="0.02" />
                                </linearGradient>
                                <linearGradient id="userGrowthStroke" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="rgb(125, 211, 252)" />
                                    <stop offset="100%" stopColor="rgb(14, 165, 233)" />
                                </linearGradient>
                            </defs>
                            <g opacity="0.9" pointerEvents="none">
                                {hGrid.map(({ val, y }, i) => (
                                    <line
                                        key={`h-${i}`}
                                        x1={PAD_L}
                                        y1={y}
                                        x2={PAD_L + innerW}
                                        y2={y}
                                        stroke="#d4d4d8"
                                        strokeWidth="1"
                                        strokeOpacity="0.95"
                                        strokeDasharray={i === 0 || i === hGrid.length - 1 ? undefined : '4 3'}
                                    />
                                ))}
                                {vGridXs.map((x, i) => (
                                    <line
                                        key={`v-${i}`}
                                        x1={x}
                                        y1={PAD_T}
                                        x2={x}
                                        y2={PAD_T + innerH}
                                        stroke="#d4d4d8"
                                        strokeWidth="1"
                                        strokeOpacity={i === 0 || i === vGridXs.length - 1 ? 0.9 : 0.65}
                                        strokeDasharray="3 4"
                                    />
                                ))}
                                <rect
                                    x={PAD_L}
                                    y={PAD_T}
                                    width={innerW}
                                    height={innerH}
                                    fill="none"
                                    stroke="#a1a1aa"
                                    strokeWidth="1"
                                    strokeOpacity="0.9"
                                    rx="2"
                                />
                            </g>
                            {hGrid.map(({ val, y }, i) => (
                                <text
                                    key={`yl-${i}`}
                                    x={PAD_L - 5}
                                    y={y}
                                    fill="#71717a"
                                    fontSize="9"
                                    fontWeight="700"
                                    textAnchor="end"
                                    dominantBaseline="middle"
                                    className="tabular-nums select-none"
                                >
                                    {Math.round(val).toLocaleString()}
                                </text>
                            ))}
                            {areaD && <path d={areaD} fill="url(#userGrowthFill)" />}
                            {lineD && (
                                <path
                                    d={lineD}
                                    fill="none"
                                    stroke="url(#userGrowthStroke)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            )}
                            {n >= 2 &&
                                [0, n - 1].map((i) => {
                                    const t = totals[i];
                                    const x = PAD_L + (i / (n - 1)) * innerW;
                                    const y = PAD_T + innerH - ((t - yMin) / yRange) * innerH;
                                    return <circle key={i} cx={x} cy={y} r="3.5" fill="#0ea5e9" stroke="#e0f2fe" strokeWidth="1.2" />;
                                })}
                        </svg>
                        <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wide px-0.5 -mt-1">
                            <span>{labelStart}</span>
                            <span>{labelEnd}</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

const AdminDashboard = () => {
    const [stats, setStats] = useState([
        { label: 'Total Programs', value: '—', change: '', icon: BookOpen, color: 'text-amber-700', bg: 'bg-amber-500/15' },
        { label: 'Scholarships', value: '—', change: '', icon: GraduationCap, color: 'text-emerald-700', bg: 'bg-emerald-500/15' },
        { label: 'Users', value: '—', change: '', icon: Users, color: 'text-blue-700', bg: 'bg-blue-500/15' },
        { label: 'System Status', value: 'Live', change: 'Stable', icon: Activity, color: 'text-rose-700', bg: 'bg-rose-500/15' },
    ]);

    const [rateRows, setRateRows] = useState([]);
    const [newRate, setNewRate] = useState({ currency: '', rate_to_usd: '' });
    const [rateErrorMsg, setRateErrorMsg] = useState('');
    const [rateToast, setRateToast] = useState(null);
    const rateToastTimerRef = useRef(null);
    const [ratePendingDelete, setRatePendingDelete] = useState(null);
    const [growthPoints, setGrowthPoints] = useState([]);

    const showRateToast = useCallback((message) => {
        setRateToast(message);
        if (rateToastTimerRef.current) clearTimeout(rateToastTimerRef.current);
        rateToastTimerRef.current = setTimeout(() => setRateToast(null), 2800);
    }, []);

    const loadRates = useCallback(async () => {
        try {
            const ratesData = await api.get('/costs/currency-rates');
            setRateRows(
                ratesData.map((row) => ({
                    ...row,
                    currency: String(row.currency || '').trim().toUpperCase(),
                    rate_to_usd: Number(row.rate_to_usd ?? 0)
                }))
            );
        } catch {
            setRateRows([]);
        }
    }, []);

    useEffect(() => {
        Promise.allSettled([
            api.get('/programs'),
            api.get('/scholarships'),
            api.get('/users/admin/stats'),
            api.get('/users/admin/growth'),
        ]).then(([programs, scholarships, users, growth]) => {
            const userStats = users.status === 'fulfilled' ? users.value : null;
            setStats([
                {
                    label: 'Total Programs',
                    value: programs.status === 'fulfilled' ? programs.value.length.toLocaleString() : '—',
                    change: programs.status === 'fulfilled' ? 'In DB' : 'Error',
                    icon: BookOpen, color: 'text-amber-700', bg: 'bg-amber-500/15'
                },
                {
                    label: 'Scholarships',
                    value: scholarships.status === 'fulfilled' ? scholarships.value.length.toLocaleString() : '—',
                    change: scholarships.status === 'fulfilled' ? 'In DB' : 'Error',
                    icon: GraduationCap, color: 'text-emerald-700', bg: 'bg-emerald-500/15'
                },
                {
                    label: 'Users',
                    value: userStats ? userStats.total_users.toLocaleString() : '—',
                    change: userStats ? `${userStats.student_users} students` : 'Error',
                    icon: Users, color: 'text-blue-700', bg: 'bg-blue-500/15'
                },
                {
                    label: 'System Status',
                    value: 'Live', change: 'Stable',
                    icon: Activity, color: 'text-rose-700', bg: 'bg-rose-500/15'
                },
            ]);
            if (growth.status === 'fulfilled' && Array.isArray(growth.value?.points)) {
                setGrowthPoints(growth.value.points);
            } else {
                setGrowthPoints([]);
            }
        });

        loadRates();
    }, [loadRates]);

    useEffect(() => {
        return () => {
            if (rateToastTimerRef.current) clearTimeout(rateToastTimerRef.current);
        };
    }, []);

    const updateRateField = (currency, value) => {
        setRateRows((prev) =>
            prev.map((row) => (row.currency === currency ? { ...row, rate_to_usd: value } : row))
        );
    };

    const saveRateRow = async (row) => {
        try {
            await api.put(`/costs/currency-rates/${row.currency}`, {
                rate_to_usd: Number(row.rate_to_usd)
            });
            await loadRates();
            showRateToast(`Saved ${row.currency} rate.`);
        } catch (err) {
            alert(`Failed to save rate: ${err.message}`);
        }
    };

    const handleDeleteRate = async (row) => {
        try {
            await api.delete(`/costs/currency-rates/${row.currency}`);
            await loadRates();
            showRateToast(`Deleted ${row.currency}.`);
        } catch (err) {
            alert(`Failed to delete rate: ${err.message}`);
            throw err;
        }
    };

    const addRate = async () => {
        setRateErrorMsg('');
        const currency = String(newRate.currency || '').trim().toUpperCase();
        const rate = Number(newRate.rate_to_usd);
        if (!/^[A-Z]{3}$/.test(currency)) {
            setRateErrorMsg('Currency must be a 3-letter ISO code (e.g. USD).');
            return;
        }
        if (!Number.isFinite(rate) || rate <= 0) {
            setRateErrorMsg('Rate to USD must be a positive number.');
            return;
        }
        try {
            await api.post('/costs/currency-rates', { currency, rate_to_usd: rate });
            setNewRate({ currency: '', rate_to_usd: '' });
            await loadRates();
            showRateToast(`Added ${currency}.`);
        } catch (err) {
            setRateErrorMsg(err.message || 'Failed to add currency rate');
        }
    };

    return (
        <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">Dashboard</h1>
                    <p className="text-zinc-600 font-medium">Overview of your platform's performance.</p>
                </div>
                <div className="flex items-center gap-3 relative">

                    <div className="px-4 py-2.5 rounded-xl bg-zinc-200 border border-zinc-300 flex items-center gap-2 text-sm font-bold text-zinc-700">
                        <Calendar size={16} />
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="relative bg-zinc-100 p-3 sm:p-4 rounded-xl border border-zinc-200 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all group flex flex-col items-center text-center gap-1.5">
                        <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-105 transition-transform`}>
                            <stat.icon size={18} />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight tabular-nums">
                            {stat.value}
                        </h3>
                        <p className="text-xs sm:text-sm font-bold text-zinc-600 leading-snug">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Currency rates + user growth chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
            <section className="relative w-full bg-zinc-100 rounded-[2rem] border border-zinc-200 overflow-hidden shadow-sm min-h-0">
                <div className="px-5 py-4 border-b border-zinc-200 bg-zinc-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700">
                            <DollarSign size={20} />
                        </div>
                        <h2 className="text-lg font-black text-zinc-900 tracking-tight">Currency rates</h2>
                    </div>
                </div>
                <div className="max-h-[min(60vh,480px)] overflow-y-auto overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-zinc-50 border-b border-zinc-200 backdrop-blur-sm">
                                <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Currency</th>
                                <th className="px-3 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Rate to USD</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase text-right min-w-[5.5rem]"> </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200/80">
                            <tr className="bg-amber-50/80 border-b border-zinc-200/80">
                                <td className="px-4 py-2 align-middle">
                                    <input
                                        value={newRate.currency}
                                        onChange={(e) => setNewRate((p) => ({ ...p, currency: e.target.value.toUpperCase() }))}
                                        placeholder="EUR"
                                        maxLength={3}
                                        className="w-16 px-2 py-1.5 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 uppercase font-mono text-sm text-center"
                                    />
                                </td>
                                <td className="px-3 py-2 align-middle">
                                    <input
                                        type="number"
                                        min="0.000001"
                                        step="0.000001"
                                        value={newRate.rate_to_usd}
                                        onChange={(e) => setNewRate((p) => ({ ...p, rate_to_usd: e.target.value }))}
                                        placeholder="1.0"
                                        className="w-full max-w-[8rem] px-2.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 tabular-nums text-sm"
                                    />
                                </td>
                                <td className="px-4 py-2 text-right align-middle">
                                    <button
                                        type="button"
                                        onClick={addRate}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-amber-500 text-amber-800 hover:bg-amber-500/15 font-bold text-xs whitespace-nowrap"
                                    >
                                        <Plus size={13} />
                                        Add new
                                    </button>
                                </td>
                            </tr>
                            {rateRows.map((row) => (
                                <tr key={row.currency} className="hover:bg-zinc-200/50">
                                    <td className="px-4 py-2 font-mono font-semibold text-zinc-900 align-middle">{row.currency}</td>
                                    <td className="px-3 py-2 align-middle">
                                        <input
                                            type="number"
                                            min="0.000001"
                                            step="0.000001"
                                            value={row.rate_to_usd}
                                            onChange={(e) => updateRateField(row.currency, e.target.value)}
                                            className="w-full max-w-[8rem] px-2.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 tabular-nums text-sm"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-right align-middle">
                                        <div className="inline-flex items-center gap-1 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => saveRateRow(row)}
                                                className="inline-flex p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black"
                                                title="Save"
                                            >
                                                <Save size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRatePendingDelete(row)}
                                                className="inline-flex p-1.5 rounded-lg bg-zinc-200 hover:bg-red-50 border border-zinc-300 hover:border-red-300 text-zinc-700 hover:text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {rateErrorMsg && (
                    <p className="px-5 py-2 text-sm text-red-600 border-t border-zinc-200">{rateErrorMsg}</p>
                )}
                {rateToast && (
                    <div
                        role="status"
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold shadow-lg z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-200"
                    >
                        {rateToast}
                    </div>
                )}
            </section>

            <UserGrowthChart points={growthPoints} />
            </div>

            <ConfirmDialog
                isOpen={ratePendingDelete != null}
                onClose={() => setRatePendingDelete(null)}
                onConfirm={() => handleDeleteRate(ratePendingDelete)}
                title={
                    ratePendingDelete
                        ? `Delete ${ratePendingDelete.currency}?`
                        : 'Delete currency rate?'
                }
                confirmText="Delete"
                cancelText="Cancel"
                message="This action cannot be undone. Are you sure you want to delete this currency rate?"
            />
        </div>
    );
};

export default AdminDashboard;
