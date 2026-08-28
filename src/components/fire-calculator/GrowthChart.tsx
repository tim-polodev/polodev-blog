"use client";

import React, { useState, useRef } from 'react';
import { YearlyData, CurrencyCode, formatCurrency } from '@/utils/calculator';

interface GrowthChartProps {
    data: YearlyData[];
    initialInvestment: number;
    fireNumber: number;
    currency: CurrencyCode;
    currentAge: number;
    adjustForInflation: boolean;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
    data,
    initialInvestment,
    fireNumber,
    currency,
    currentAge,
    adjustForInflation,
}) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    if (!data || data.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No calculation data available.
            </div>
        );
    }

    // Prepare chart points: point 0 is initial state (Year 0)
    const points = [
        {
            year: 0,
            age: currentAge,
            totalContributed: initialInvestment,
            totalInterestEarned: 0,
            endBalance: initialInvestment,
            realEndBalance: initialInvestment,
        },
        ...data,
    ];

    // Chart dimensions
    const width = 760;
    const height = 340;
    const padding = { top: 25, right: 30, bottom: 45, left: 75 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate max Y value (considering portfolio growth & FIRE number)
    const maxDataValue = Math.max(
        ...points.map((p) => (adjustForInflation ? p.realEndBalance : p.endBalance))
    );
    const maxY = Math.max(maxDataValue * 1.1, fireNumber * 1.15, 10000);

    const getX = (index: number) => padding.left + (index / (points.length - 1)) * chartWidth;
    const getY = (val: number) => padding.top + chartHeight - (val / maxY) * chartHeight;

    // Generate Path for Total Balance (Top curve)
    const balanceCoords = points.map((p, i) => {
        const val = adjustForInflation ? p.realEndBalance : p.endBalance;
        return `${getX(i)},${getY(val)}`;
    });

    // Generate Path for Principal Contributed
    const principalCoords = points.map((p, i) => `${getX(i)},${getY(p.totalContributed)}`);

    // Area Paths
    const bottomY = padding.top + chartHeight;
    const totalAreaPath = `M ${getX(0)},${bottomY} L ${balanceCoords.join(' L ')} L ${getX(points.length - 1)},${bottomY} Z`;
    const principalAreaPath = `M ${getX(0)},${bottomY} L ${principalCoords.join(' L ')} L ${getX(points.length - 1)},${bottomY} Z`;
    const balanceLinePath = `M ${balanceCoords.join(' L ')}`;
    const principalLinePath = `M ${principalCoords.join(' L ')}`;

    // Y Grid lines (4 ticks)
    const yTicks = [0, maxY * 0.25, maxY * 0.5, maxY * 0.75, maxY];

    // X Ticks step
    const xTickStep = Math.max(1, Math.ceil(points.length / 6));

    // Handle mouse hover
    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const scaleX = width / rect.width;
        const mouseX = clientX * scaleX - padding.left;
        const clampedMouseX = Math.max(0, Math.min(chartWidth, mouseX));
        const index = Math.round((clampedMouseX / chartWidth) * (points.length - 1));
        setHoverIndex(index);
    };

    const handleMouseLeave = () => {
        setHoverIndex(null);
    };

    const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;
    const activeBalance = activePoint ? (adjustForInflation ? activePoint.realEndBalance : activePoint.endBalance) : 0;
    const activeInterest = activePoint ? Math.max(0, activeBalance - activePoint.totalContributed) : 0;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-4">
            {/* Chart Title and Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>📊</span>
                        <span>Portfolio Growth &amp; FIRE Projection</span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {adjustForInflation ? 'Values adjusted for inflation (purchasing power)' : 'Future nominal compound growth'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                        <span className="w-3 h-3 rounded-xs bg-blue-500 inline-block" />
                        <span>Principal Contributed</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
                        <span>Compound Interest</span>
                    </div>
                    {fireNumber > 0 && (
                        <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                            <span className="w-3.5 h-0.5 bg-purple-500 border-b border-dashed border-purple-500 inline-block" />
                            <span>FIRE Target</span>
                        </div>
                    )}
                </div>
            </div>

            {/* SVG Chart Container */}
            <div className="relative w-full overflow-hidden select-none">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-auto cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    role="img"
                    aria-label="Interactive compound interest growth chart"
                >
                    <defs>
                        <linearGradient id="interestAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="principalAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
                        </linearGradient>
                    </defs>

                    {/* Y Grid Lines & Labels */}
                    {yTicks.map((tick, i) => {
                        const y = getY(tick);
                        return (
                            <g key={i}>
                                <line
                                    x1={padding.left}
                                    y1={y}
                                    x2={padding.left + chartWidth}
                                    y2={y}
                                    stroke="currentColor"
                                    className="text-gray-200 dark:text-gray-800"
                                    strokeDasharray={i === 0 ? undefined : '3,3'}
                                    strokeWidth="1"
                                />
                                <text
                                    x={padding.left - 8}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="text-[10px] fill-gray-400 dark:fill-gray-500 font-mono"
                                >
                                    {formatCurrency(tick, currency, true)}
                                </text>
                            </g>
                        );
                    })}

                    {/* X Grid Lines & Labels */}
                    {points.map((p, i) => {
                        if (i % xTickStep !== 0 && i !== points.length - 1) return null;
                        const x = getX(i);
                        return (
                            <g key={i}>
                                <line
                                    x1={x}
                                    y1={padding.top}
                                    x2={x}
                                    y2={padding.top + chartHeight}
                                    stroke="currentColor"
                                    className="text-gray-100 dark:text-gray-800/40"
                                    strokeWidth="1"
                                />
                                <text
                                    x={x}
                                    y={padding.top + chartHeight + 16}
                                    textAnchor="middle"
                                    className="text-[10px] fill-gray-500 dark:fill-gray-400 font-semibold"
                                >
                                    {p.year === 0 ? 'Now' : `Yr ${p.year}`}
                                </text>
                                <text
                                    x={x}
                                    y={padding.top + chartHeight + 28}
                                    textAnchor="middle"
                                    className="text-[9px] fill-gray-400 dark:fill-gray-500"
                                >
                                    {p.age}yo
                                </text>
                            </g>
                        );
                    })}

                    {/* Stacked Growth Areas */}
                    <path d={totalAreaPath} fill="url(#interestAreaGrad)" />
                    <path d={principalAreaPath} fill="url(#principalAreaGrad)" />

                    {/* Top Stroke Lines */}
                    <path
                        d={principalLinePath}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />
                    <path
                        d={balanceLinePath}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />

                    {/* FIRE Target Horizontal Line */}
                    {fireNumber > 0 && fireNumber <= maxY && (
                        <g>
                            <line
                                x1={padding.left}
                                y1={getY(fireNumber)}
                                x2={padding.left + chartWidth}
                                y2={getY(fireNumber)}
                                stroke="#9333ea"
                                strokeWidth="2"
                                strokeDasharray="6,4"
                            />
                            <text
                                x={padding.left + chartWidth - 6}
                                y={getY(fireNumber) - 6}
                                textAnchor="end"
                                className="text-[10px] font-bold fill-purple-600 dark:fill-purple-400"
                            >
                                FIRE Target: {formatCurrency(fireNumber, currency, true)}
                            </text>
                        </g>
                    )}

                    {/* Active Hover Guide & Markers */}
                    {activePoint && hoverIndex !== null && (
                        <g>
                            <line
                                x1={getX(hoverIndex)}
                                y1={padding.top}
                                x2={getX(hoverIndex)}
                                y2={padding.top + chartHeight}
                                stroke="#6366f1"
                                strokeWidth="1.5"
                                strokeDasharray="3,3"
                            />
                            {/* Circle at Principal */}
                            <circle
                                cx={getX(hoverIndex)}
                                cy={getY(activePoint.totalContributed)}
                                r="4.5"
                                fill="#2563eb"
                                stroke="#ffffff"
                                strokeWidth="2"
                            />
                            {/* Circle at Total Balance */}
                            <circle
                                cx={getX(hoverIndex)}
                                cy={getY(activeBalance)}
                                r="5.5"
                                fill="#059669"
                                stroke="#ffffff"
                                strokeWidth="2"
                            />
                        </g>
                    )}
                </svg>

                {/* Floating Interactive Tooltip */}
                {activePoint && hoverIndex !== null && (
                    <div
                        className="absolute top-2 right-2 sm:top-4 sm:right-6 pointer-events-none bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 text-xs space-y-1.5 animate-in fade-in duration-100 z-10 min-w-[200px]"
                    >
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-1 font-bold text-gray-900 dark:text-white">
                            <span>{activePoint.year === 0 ? 'Starting Point' : `Year ${activePoint.year}`}</span>
                            <span className="text-gray-500 font-normal">Age {activePoint.age}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                Contributed:
                            </span>
                            <span className="font-semibold font-mono">
                                {formatCurrency(activePoint.totalContributed, currency)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Interest:
                            </span>
                            <span className="font-semibold font-mono">
                                +{formatCurrency(activeInterest, currency)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-gray-100 dark:border-gray-700 font-bold text-gray-900 dark:text-white text-sm">
                            <span>Total Balance:</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                                {formatCurrency(activeBalance, currency)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
