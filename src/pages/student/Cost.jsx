import React, { useState, useEffect, useRef } from 'react';
import { Home, UtensilsCrossed, Train, Wallet, MapPin, Globe, TrendingUp } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import api from '../../services/api';

/* ─── Fonts ─────────────────────────────────────────────────── */
const FontImport = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .ce-root * { font-family: inherit; }
        .ce-display  { font-family: inherit; }

        @keyframes ce-spin  { to { transform: rotate(1turn); } }
        @keyframes ce-fade  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ce-bar   { from { width: 0; } }

        .ce-fade  { animation: ce-fade 0.45s ease both; }
        .ce-fade1 { animation: ce-fade 0.45s 0.05s ease both; }
        .ce-fade2 { animation: ce-fade 0.45s 0.12s ease both; }
        .ce-fade3 { animation: ce-fade 0.45s 0.19s ease both; }
        .ce-fade4 { animation: ce-fade 0.45s 0.26s ease both; }
        .ce-bar-anim { animation: ce-bar 0.8s cubic-bezier(.22,1,.36,1) both; }

        .ce-pill {
            display: flex; align-items: center; gap: 6px;
            padding: 6px 14px; border-radius: 99px; cursor: pointer;
            font-size: 12px; font-weight: 600; letter-spacing: .02em;
            transition: background .18s, color .18s, box-shadow .18s;
            border: 1.5px solid transparent;
        }
        .ce-pill.active {
            background: #0f172a; color: #fff;
            box-shadow: 0 2px 12px #0f172a33;
        }
        .ce-pill:not(.active) {
            background: transparent; color: #94a3b8;
            border-color: #e2e8f0;
        }
        .ce-pill:not(.active):hover { color: #0f172a; border-color: #0f172a22; background: #f8fafc; }

        .ce-select-wrap { position: relative; }
        .ce-select-wrap svg.icon {
            position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
            pointer-events: none; color: #94a3b8;
        }
        .ce-select {
            width: 100%; padding: 9px 32px 9px 34px;
            border: 1.5px solid #e2e8f0; border-radius: 12px;
            background: #fff; color: #0f172a;
            font-size: 13px; font-weight: 600;
            appearance: none; cursor: pointer;
            transition: border-color .18s, box-shadow .18s;
            outline: none;
        }
        .ce-select:focus { border-color: #0f172a; box-shadow: 0 0 0 3px #0f172a12; }
        .ce-chevron {
            position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
            pointer-events: none; font-size: 9px; color: #94a3b8;
        }

        .ce-cat-row {
            display: flex; align-items: center; gap: 14px;
            padding: 10px 12px; border-radius: 14px;
            transition: background .15s;
            cursor: default;
        }
        .ce-cat-row:hover { background: #f8fafc; }
        .ce-icon-box {
            width: 38px; height: 38px; border-radius: 11px;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; transition: transform .2s;
        }
        .ce-cat-row:hover .ce-icon-box { transform: scale(1.07); }

        .ce-card {
            background: #f5f3ff; border: 1.5px solid #6366f1;
            border-radius: 22px;
            box-shadow: 0 4px 24px #6366f10e, 0 1px 4px #6366f108;
        }
        .ce-gradient-border {
            padding: 1.5px; border-radius: 22px;
            background: #6366f1;
        }
        .ce-gradient-inner {
            background: #f5f3ff; border-radius: 21px;
            height: 100%;
        }

        .ce-loader { animation: ce-spin 1s linear infinite; }

        .ce-total-num { font-size: 44px; line-height: 1; color: #0f172a; font-weight: 800; }
        .ce-total-label { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #94a3b8; }

        .ce-seg-label { font-size: 11px; font-weight: 600; color: #64748b; }
        .ce-seg-pct   { font-size: 11px; font-weight: 800; color: #0f172a; }
        .ce-seg-val   { font-size: 12px; font-weight: 700; color: #475569; }

        .ce-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

        .ce-filters { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; padding: 16px 20px; display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap; box-shadow: 0 2px 12px #0f172a06; }
        .ce-filter-group { display: flex; flex-direction: column; gap: 5px; }
        .ce-filter-label { font-size: 9px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #94a3b8; }
        .ce-divider { width: 1px; height: 36px; background: #f1f5f9; align-self: center; }

        .ce-summary-tag {
            display: inline-flex; align-items: center; gap: 5px;
            background: #f1f5f9; color: #475569;
            border-radius: 8px; padding: 4px 10px;
            font-size: 11px; font-weight: 600;
        }

        .ce-main-row { display: flex; flex-direction: column; gap: 14px; align-items: stretch; }
        .ce-cost-left { width: 100%; flex-shrink: 0; }
        .ce-inner-pad { padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; }
        .ce-chart-pad { padding: 16px 18px; gap: 14px; }

        @media (min-width: 768px) {
            .ce-main-row { flex-direction: row; gap: 20px; }
            .ce-cost-left { width: 48%; }
            .ce-inner-pad { padding: 24px 26px; gap: 20px; }
            .ce-chart-pad { padding: 24px 28px; gap: 20px; }
        }

        @media (max-width: 767px) {
            .ce-filters { padding: 10px 12px; gap: 10px; border-radius: 14px; }
            .ce-divider { display: none; }
            .ce-total-num { font-size: 32px; }
        }
    `}</style>
);

/* ─── Fixed Donut Chart ──────────────────────────────────────── */
const DonutChart = ({ segments }) => {
    const r = 72, stroke = 26, gap = 2.5;
    const size = 200, cx = 100, cy = 100;
    const C = 2 * Math.PI * r;
    const total = segments.reduce((s, g) => s + g.value, 0);
    if (!total) return null;

    // Correct offset math: start each slice where the previous ended
    const slices = [];
    let accumulated = 0;
    for (const seg of segments) {
        const pct = seg.value / total;
        const segLen = Math.max(pct * C - gap, 0);
        // dashoffset rotates the starting point: C - accumulated shifts by accumulated arc
        const offset = C - accumulated;
        slices.push({ color: seg.color, segLen, offset });
        accumulated += pct * C;
    }

    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[200px] mx-auto" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
            {slices.map((s, i) => (
                <circle
                    key={i}
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={stroke}
                    strokeDasharray={`${s.segLen} ${C - s.segLen}`}
                    strokeDashoffset={s.offset}
                    strokeLinecap="butt"
                    style={{ transition: 'stroke-dasharray .6s cubic-bezier(.22,1,.36,1), stroke-dashoffset .6s cubic-bezier(.22,1,.36,1)' }}
                />
            ))}
        </svg>
    );
};

/* ─── Main ───────────────────────────────────────────────────── */
const CostEstimator = () => {
    const [costsData, setCostsData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [lifestyle, setLifestyle] = useState('Medium');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/costs')
            .then(data => {
                setCostsData(data);
                if (data.length > 0) {
                    setSelectedCountry(data[0].country);
                    setSelectedCity(data[0].city);
                }
            })
            .catch(err => console.error('Failed to load costs:', err))
            .finally(() => setLoading(false));
    }, []);

    const countries = [...new Set(costsData.map(c => c.country))];
    const cities = [...new Set(costsData.filter(c => c.country === selectedCountry).map(c => c.city))];

    const handleCountryChange = (country) => {
        setSelectedCountry(country);
        const first = costsData.find(c => c.country === country);
        if (first) setSelectedCity(first.city);
    };

    const cityData = costsData.find(c => c.city === selectedCity);

    const multipliers = {
        Low: { rent: 0.65, food: 0.80, transport: 0.95 },
        Medium: { rent: 1.00, food: 1.00, transport: 1.00 },
        High: { rent: 1.55, food: 1.25, transport: 1.10 },
    };

    const calculate = () => {
        if (!cityData) return { rent: 0, food: 0, transport: 0, total: 0 };
        const m = multipliers[lifestyle];
        const rent = Math.round(Number(cityData.rent) * m.rent);
        const food = Math.round(Number(cityData.food) * m.food);
        const transport = Math.round(Number(cityData.transport) * m.transport);
        return { rent, food, transport, total: rent + food + transport };
    };

    const costs = calculate();
    const currency = cityData?.currency ?? '';

    const categories = [
        { label: 'Accommodation', value: costs.rent, icon: Home, color: '#6366f1', bg: '#6366f115' },
        { label: 'Food & Groceries', value: costs.food, icon: UtensilsCrossed, color: '#10b981', bg: '#10b98115' },
        { label: 'Transport', value: costs.transport, icon: Train, color: '#f59e0b', bg: '#f59e0b15' },
    ];

    return (
        <div className="ce-root max-w-5xl mx-auto space-y-3 pb-8 md:space-y-5 md:pb-12">
            <FontImport />

            <PageHeader
                title="Cost Estimator"
                subtitle="Plan your monthly student budget by destination"
                icon={Wallet}
            />

            {/* ── Filters ─── */}
            <div className="ce-filters ce-fade">
                <div className="ce-filter-group flex-1 min-w-[130px]">
                    <span className="ce-filter-label">Country</span>
                    <div className="ce-select-wrap">
                        <Globe size={13} className="icon" />
                        <select value={selectedCountry} onChange={e => handleCountryChange(e.target.value)} className="ce-select">
                            {countries.map((c, i) => <option key={`${c}-${i}`}>{c}</option>)}
                        </select>
                        <span className="ce-chevron">▼</span>
                    </div>
                </div>

                <div className="ce-divider" />

                <div className="ce-filter-group flex-1 min-w-[130px]">
                    <span className="ce-filter-label">City</span>
                    <div className="ce-select-wrap">
                        <MapPin size={13} className="icon" />
                        <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="ce-select">
                            {cities.map((c, i) => <option key={`${c}-${i}`}>{c}</option>)}
                        </select>
                        <span className="ce-chevron">▼</span>
                    </div>
                </div>

                <div className="ce-divider" />

                <div className="ce-filter-group">
                    <span className="ce-filter-label">Lifestyle</span>
                    <div style={{ display: 'flex', gap: 6, background: '#f8fafc', padding: '4px', borderRadius: 12, border: '1.5px solid #f1f5f9' }}>
                        {['Low', 'Medium', 'High'].map(l => (
                            <button key={l} onClick={() => setLifestyle(l)} className={`ce-pill${lifestyle === l ? ' active' : ''}`}>
                                {l}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Cards ─── */}
            {loading || !cityData ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', flexDirection: 'column', gap: 12 }}>
                    <div className="ce-loader" style={{ width: 32, height: 32, border: '3px solid #f1f5f9', borderTopColor: '#0f172a', borderRadius: '50%' }} />
                    <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>Loading cost data…</p>
                </div>
            ) : (
                <div className="ce-main-row">

                    {/* ── Left: Dark summary card ── */}
                    <div className="ce-gradient-border ce-fade1 ce-cost-left">
                        <div className="ce-gradient-inner ce-inner-pad">

                            {/* Header */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <span className="ce-total-label">Monthly Estimate</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                    <span className="ce-total-num">{currency}{costs.total.toLocaleString()}</span>
                                    <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>/mo</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                                    <MapPin size={11} color="#94a3b8" />
                                    <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{selectedCity}, {selectedCountry}</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ height: 1, background: 'linear-gradient(90deg, #e2e8f0, transparent)' }} />

                            {/* Categories */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {categories.map((cat, i) => {
                                    const Icon = cat.icon;
                                    const pct = costs.total > 0 ? Math.round((cat.value / costs.total) * 100) : 0;
                                    return (
                                        <div key={cat.label} className={`ce-cat-row ce-fade${i + 2}`} style={{ '--bg': '#1e293b' }}>
                                            <div className="ce-icon-box" style={{ background: cat.color + '18', border: `1px solid ${cat.color}30` }}>
                                                <Icon size={16} color={cat.color} strokeWidth={2} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ marginBottom: 4 }}>
                                                    <span className="ce-seg-label">{cat.label}</span>
                                                </div>
                                                <div style={{ height: 3, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                                                    <div className="ce-bar-anim" style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: 99 }} />
                                                </div>
                                            </div>
                                            <span className="ce-seg-val" style={{ minWidth: 72, textAlign: 'right' }}>
                                                {currency}{cat.value.toLocaleString()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Chart card ── */}
                    <div className="ce-card ce-fade2 ce-chart-pad" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                        {/* Donut */}
                        <div style={{ position: 'relative', width: 200 }}>
                            <DonutChart
                                key={`${costs.rent}-${costs.food}-${costs.transport}-${lifestyle}`}
                                segments={categories.map(c => ({ value: c.value, color: c.color }))}
                            />
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 260 }}>
                            {categories.map(cat => {
                                const pct = costs.total > 0 ? Math.round((cat.value / costs.total) * 100) : 0;
                                return (
                                    <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div className="ce-dot" style={{ background: cat.color }} />
                                        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#475569' }}>{cat.label}</span>
                                        <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', minWidth: 32, textAlign: 'right' }}>{pct}%</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer note */}
                        <div style={{ borderTop: '1px solid #f1f5f9', width: '100%', paddingTop: 14, textAlign: 'center' }}>
                            <span style={{ fontSize: 10, color: '#000000bd', fontWeight: 500 }}>
                                Estimates based on average student spending · Adjust lifestyle for range
                            </span>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default CostEstimator;