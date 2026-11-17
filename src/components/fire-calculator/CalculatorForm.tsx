"use client";

import React, { useState } from 'react';
import {
    CalculationParams,
    CurrencyCode,
    CURRENCIES,
    formatCurrency,
    LifeStageSegment,
    getDefaultSegmentsVND,
    getDefaultSegmentsUSD,
} from '@/utils/calculator';

interface CalculatorFormProps {
    params: CalculationParams;
    onChange: (updated: Partial<CalculationParams>) => void;
    currency: CurrencyCode;
    onCurrencyChange: (currency: CurrencyCode) => void;
}

export const PRESETS_VND = [
    {
        name: 'Standard FIRE',
        desc: 'Steady 3.5% salary growth & 2.5% expense inflation',
        params: {
            initialInvestment: 100_000_000,
            monthlyContribution: 15_000_000,
            monthlyIncome: 35_000_000,
            annualIncomeGrowthRate: 3.5,
            annualExpenses: 240_000_000,
            annualExpenseGrowthRate: 2.5,
            annualReturnRate: 8.0,
            investmentHorizonYears: 20,
            currentAge: 28,
            safeWithdrawalRate: 4.0,
            inflationRate: 3.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
    {
        name: 'Aggressive Saver',
        desc: 'Fast-track 7% income growth & high 55%+ savings rate',
        params: {
            initialInvestment: 250_000_000,
            monthlyContribution: 40_000_000,
            monthlyIncome: 70_000_000,
            annualIncomeGrowthRate: 7.0,
            annualExpenses: 360_000_000,
            annualExpenseGrowthRate: 3.0,
            annualReturnRate: 9.0,
            investmentHorizonYears: 12,
            currentAge: 30,
            safeWithdrawalRate: 4.0,
            inflationRate: 3.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
    {
        name: 'Family Expansion',
        desc: 'Higher 5% expense creep for kids & housing as career expands',
        params: {
            initialInvestment: 150_000_000,
            monthlyContribution: 18_000_000,
            monthlyIncome: 45_000_000,
            annualIncomeGrowthRate: 4.0,
            annualExpenses: 324_000_000,
            annualExpenseGrowthRate: 5.0,
            annualReturnRate: 8.0,
            investmentHorizonYears: 22,
            currentAge: 32,
            safeWithdrawalRate: 4.0,
            inflationRate: 3.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
    {
        name: 'Young Starter',
        desc: 'Start small with lean expenses & long runway',
        params: {
            initialInvestment: 20_000_000,
            monthlyContribution: 6_000_000,
            monthlyIncome: 15_000_000,
            annualIncomeGrowthRate: 4.0,
            annualExpenses: 108_000_000,
            annualExpenseGrowthRate: 2.0,
            annualReturnRate: 8.5,
            investmentHorizonYears: 30,
            currentAge: 22,
            safeWithdrawalRate: 4.0,
            inflationRate: 3.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
    {
        name: 'Coast FIRE',
        desc: 'Front-load capital early & let compound interest grow',
        params: {
            initialInvestment: 600_000_000,
            monthlyContribution: 3_000_000,
            monthlyIncome: 30_000_000,
            annualIncomeGrowthRate: 0.0,
            annualExpenses: 240_000_000,
            annualExpenseGrowthRate: 2.0,
            annualReturnRate: 8.0,
            investmentHorizonYears: 25,
            currentAge: 32,
            safeWithdrawalRate: 3.75,
            inflationRate: 3.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
];

export const PRESETS_USD = [
    {
        name: 'Standard FIRE',
        desc: 'Steady 3.5% salary growth & 2.5% expense inflation',
        params: {
            initialInvestment: 25000,
            monthlyContribution: 1500,
            monthlyIncome: 4500,
            annualIncomeGrowthRate: 3.5,
            annualExpenses: 36000,
            annualExpenseGrowthRate: 2.5,
            annualReturnRate: 8.0,
            investmentHorizonYears: 20,
            currentAge: 28,
            annualExpensesBaseline: 36000,
            safeWithdrawalRate: 4.0,
            inflationRate: 2.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
    {
        name: 'Aggressive Saver',
        desc: 'High savings rate & 12-year fast track',
        params: {
            initialInvestment: 50000,
            monthlyContribution: 3500,
            monthlyIncome: 7000,
            annualIncomeGrowthRate: 7.0,
            annualExpenses: 42000,
            annualExpenseGrowthRate: 3.0,
            annualReturnRate: 9.0,
            investmentHorizonYears: 12,
            currentAge: 30,
            safeWithdrawalRate: 4.0,
            inflationRate: 2.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
    {
        name: 'Family Expansion',
        desc: 'Higher 5% expense creep for home & family while career advances',
        params: {
            initialInvestment: 35000,
            monthlyContribution: 2000,
            monthlyIncome: 6000,
            annualIncomeGrowthRate: 4.0,
            annualExpenses: 48000,
            annualExpenseGrowthRate: 5.0,
            annualReturnRate: 8.0,
            investmentHorizonYears: 22,
            currentAge: 32,
            safeWithdrawalRate: 4.0,
            inflationRate: 2.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
    {
        name: 'Young Starter',
        desc: 'Start small with lean expenses & massive runway',
        params: {
            initialInvestment: 5000,
            monthlyContribution: 800,
            monthlyIncome: 2500,
            annualIncomeGrowthRate: 4.0,
            annualExpenses: 20000,
            annualExpenseGrowthRate: 2.0,
            annualReturnRate: 8.5,
            investmentHorizonYears: 35,
            currentAge: 22,
            safeWithdrawalRate: 4.0,
            inflationRate: 2.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
    {
        name: 'Coast FIRE',
        desc: 'Front-load growth early',
        params: {
            initialInvestment: 120000,
            monthlyContribution: 400,
            monthlyIncome: 4000,
            annualIncomeGrowthRate: 0.0,
            annualExpenses: 42000,
            annualExpenseGrowthRate: 2.0,
            annualReturnRate: 8.0,
            investmentHorizonYears: 25,
            currentAge: 32,
            safeWithdrawalRate: 3.75,
            inflationRate: 2.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
];

export const PRESET_CONFIG: Record<
    string,
    {
        icon: React.ReactNode;
        iconBg: string;
        hoverBorder: string;
        hoverBg: string;
        shadow: string;
        accentText: string;
    }
> = {
    'Standard FIRE': {
        icon: (
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
        iconBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200/80 dark:border-blue-800/60 text-blue-600 dark:text-blue-400',
        hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-500',
        hoverBg: 'hover:bg-blue-50/50 dark:hover:bg-blue-950/30',
        shadow: 'hover:shadow-blue-500/10',
        accentText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    },
    'Aggressive Saver': {
        icon: (
            <svg className="w-4 h-4 text-amber-500 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        iconBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/60 text-amber-500 dark:text-amber-400',
        hoverBorder: 'hover:border-amber-400 dark:hover:border-amber-500',
        hoverBg: 'hover:bg-amber-50/50 dark:hover:bg-amber-950/30',
        shadow: 'hover:shadow-amber-500/10',
        accentText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    },
    'Family Expansion': {
        icon: (
            <svg className="w-4 h-4 text-rose-500 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
        iconBg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200/80 dark:border-rose-800/60 text-rose-500 dark:text-rose-400',
        hoverBorder: 'hover:border-rose-400 dark:hover:border-rose-500',
        hoverBg: 'hover:bg-rose-50/50 dark:hover:bg-rose-950/30',
        shadow: 'hover:shadow-rose-500/10',
        accentText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    },
    'Coast FIRE': {
        icon: (
            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 20a4 4 0 0 0 4 0 4 4 0 0 1 4 0 4 4 0 0 0 4 0 4 4 0 0 1 4 0 4 4 0 0 0 4 0" />
                <path d="M12 18V4" />
                <path d="m12 4 7 10h-7" />
                <path d="m12 8-5 6h5" />
            </svg>
        ),
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400',
        hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500',
        hoverBg: 'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30',
        shadow: 'hover:shadow-emerald-500/10',
        accentText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    },
    'Young Starter': {
        icon: (
            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 20h10" />
                <path d="M10 20c0-6 4-9 4-15" />
                <path d="M14 8c-3-2-6 0-6 3 0 4 6 5 6 5" />
                <path d="M14 5c3-2 6 0 6 3 0 4-6 5-6 5" />
            </svg>
        ),
        iconBg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200/80 dark:border-purple-800/60 text-purple-600 dark:text-purple-400',
        hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-500',
        hoverBg: 'hover:bg-purple-50/50 dark:hover:bg-purple-950/30',
        shadow: 'hover:shadow-purple-500/10',
        accentText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    },
};

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
    params,
    onChange,
    currency,
    onCurrencyChange,
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [advancedTab, setAdvancedTab] = useState<'stages' | 'income' | 'expenses' | 'assumptions'>('stages');
    const curr = CURRENCIES[currency] || CURRENCIES.VND;
    const presets = currency === 'VND' ? PRESETS_VND : PRESETS_USD;

    const isVND = currency === 'VND';
    const initialMax = isVND ? 5_000_000_000 : 500_000;
    const initialStep = isVND ? 10_000_000 : 5_000;
    const monthlyMax = isVND ? 100_000_000 : 15_000;
    const monthlyStep = isVND ? 1_000_000 : 100;
    const expenseStep = isVND ? 5_000_000 : 1_000;
    const incomeStep = isVND ? 1_000_000 : 100;
    const incomeMax = isVND ? 200_000_000 : 30_000;

    const currentMonthlyIncome = params.monthlyIncome ?? (isVND ? 35_000_000 : 4_500);
    const currentIncomeGrowth = params.annualIncomeGrowthRate ?? 0;
    const currentExpenseGrowth = params.annualExpenseGrowthRate ?? 0;
    const monthlyExpenses = params.annualExpenses / 12;
    const netCashFlow = currentMonthlyIncome - monthlyExpenses;
    const savingsRate = currentMonthlyIncome > 0 ? (params.monthlyContribution / currentMonthlyIncome) * 100 : 0;

    const currentSegments: LifeStageSegment[] =
        params.segments && params.segments.length > 0
            ? params.segments
            : isVND
            ? getDefaultSegmentsVND(params.currentAge)
            : getDefaultSegmentsUSD(params.currentAge);

    const handleSegmentChange = (index: number, updatedFields: Partial<LifeStageSegment>) => {
        const updatedSegments = currentSegments.map((seg, i) => {
            if (i !== index) return seg;
            const newSeg = { ...seg, ...updatedFields };
            if (updatedFields.monthlyIncome !== undefined || updatedFields.monthlyExpenses !== undefined) {
                if (updatedFields.monthlyContribution === undefined) {
                    newSeg.monthlyContribution = Math.max(0, newSeg.monthlyIncome - newSeg.monthlyExpenses);
                }
            }
            return newSeg;
        });
        onChange({ segments: updatedSegments, useCustomSegments: true });
    };

    const handleAddSegment = () => {
        const lastSeg = currentSegments[currentSegments.length - 1];
        const newFromAge = lastSeg ? lastSeg.toAge + 1 : params.currentAge;
        const newToAge = newFromAge + 9;
        const newSegment: LifeStageSegment = {
            id: `stage_${Date.now()}`,
            name: `Stage ${currentSegments.length + 1}`,
            fromAge: newFromAge,
            toAge: newToAge,
            monthlyIncome: lastSeg ? lastSeg.monthlyIncome : (isVND ? 40_000_000 : 5_000),
            monthlyExpenses: lastSeg ? Math.max(0, lastSeg.monthlyExpenses - (isVND ? 5_000_000 : 500)) : (isVND ? 20_000_000 : 2_500),
            monthlyContribution: lastSeg ? lastSeg.monthlyContribution : (isVND ? 20_000_000 : 2_500),
        };
        onChange({ segments: [...currentSegments, newSegment], useCustomSegments: true });
    };

    const handleDeleteSegment = (index: number) => {
        if (currentSegments.length <= 1) return;
        const updated = currentSegments.filter((_, i) => i !== index);
        onChange({ segments: updated, useCustomSegments: true });
    };

    const handleApplySegmentTemplate = (templateKey: 'family' | 'coast' | 'career') => {
        let newSegments: LifeStageSegment[];
        if (templateKey === 'family') {
            newSegments = isVND ? getDefaultSegmentsVND(params.currentAge) : getDefaultSegmentsUSD(params.currentAge);
        } else if (templateKey === 'coast') {
            newSegments = isVND
                ? [
                    { id: 'sprint', name: 'Aggressive Sprint (Peak Savings)', fromAge: params.currentAge, toAge: params.currentAge + 9, monthlyIncome: 60_000_000, monthlyExpenses: 20_000_000, monthlyContribution: 40_000_000 },
                    { id: 'coast', name: 'Coast / Passion Work', fromAge: params.currentAge + 10, toAge: params.currentAge + 24, monthlyIncome: 25_000_000, monthlyExpenses: 18_000_000, monthlyContribution: 7_000_000 },
                    { id: 'slow', name: 'Downshift & Freedom (Costs Drop)', fromAge: params.currentAge + 25, toAge: params.currentAge + 40, monthlyIncome: 16_000_000, monthlyExpenses: 16_000_000, monthlyContribution: 0 },
                ]
                : [
                    { id: 'sprint', name: 'Aggressive Sprint (Peak Savings)', fromAge: params.currentAge, toAge: params.currentAge + 9, monthlyIncome: 8_000, monthlyExpenses: 3_000, monthlyContribution: 5_000 },
                    { id: 'coast', name: 'Coast / Passion Work', fromAge: params.currentAge + 10, toAge: params.currentAge + 24, monthlyIncome: 4_000, monthlyExpenses: 3_000, monthlyContribution: 1_000 },
                    { id: 'slow', name: 'Downshift & Freedom (Costs Drop)', fromAge: params.currentAge + 25, toAge: params.currentAge + 40, monthlyIncome: 2_000, monthlyExpenses: 2_000, monthlyContribution: 0 },
                ];
        } else {
            newSegments = isVND
                ? [
                    { id: 'early', name: 'Early Career Foundation', fromAge: 22, toAge: 32, monthlyIncome: 22_000_000, monthlyExpenses: 12_000_000, monthlyContribution: 10_000_000 },
                    { id: 'mid', name: 'Mid Career & Family Growth', fromAge: 33, toAge: 48, monthlyIncome: 55_000_000, monthlyExpenses: 30_000_000, monthlyContribution: 25_000_000 },
                    { id: 'senior', name: 'Senior Career & Empty Nest (Costs Drop)', fromAge: 49, toAge: 62, monthlyIncome: 85_000_000, monthlyExpenses: 22_000_000, monthlyContribution: 63_000_000 },
                ]
                : [
                    { id: 'early', name: 'Early Career Foundation', fromAge: 22, toAge: 32, monthlyIncome: 3_500, monthlyExpenses: 2_200, monthlyContribution: 1_300 },
                    { id: 'mid', name: 'Mid Career & Family Growth', fromAge: 33, toAge: 48, monthlyIncome: 7_500, monthlyExpenses: 4_500, monthlyContribution: 3_000 },
                    { id: 'senior', name: 'Senior Career & Empty Nest (Costs Drop)', fromAge: 49, toAge: 62, monthlyIncome: 11_000, monthlyExpenses: 3_500, monthlyContribution: 7_500 },
                ];
        }
        onChange({ segments: newSegments, useCustomSegments: true });
    };

    const handleNumberChange = (key: keyof CalculationParams, value: string) => {
        const parsed = parseFloat(value);
        onChange({ [key]: isNaN(parsed) ? 0 : parsed });
    };

    const handleCurrencySelect = (newCurrency: CurrencyCode) => {
        if (newCurrency === currency) return;
        onCurrencyChange(newCurrency);

        // Auto-scale default parameters if switching between VND and USD
        if (newCurrency === 'USD' && params.initialInvestment > 1_000_000) {
            onChange(PRESETS_USD[0].params);
        } else if (newCurrency === 'VND' && params.initialInvestment < 1_000_000) {
            onChange(PRESETS_VND[0].params);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-6">
            {/* Header & Currency Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>⚙️</span>
                        <span>Calculator Parameters</span>
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Customize your savings, target returns, and FIRE assumptions
                    </p>
                </div>

                {/* Currency Switcher: VND & USD */}
                <div className="flex items-center gap-2">
                    <label htmlFor="currency-select" className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        Currency:
                    </label>
                    <select
                        id="currency-select"
                        value={currency}
                        onChange={(e) => handleCurrencySelect(e.target.value as CurrencyCode)}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-hidden font-bold cursor-pointer"
                    >
                        <option value="VND">VND (₫)</option>
                        <option value="USD">USD ($)</option>
                    </select>
                </div>
            </div>

            {/* Quick Presets */}
            <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2.5 block">
                    Quick Scenario Presets
                </span>
                <div className="grid grid-cols-2 gap-3 items-stretch">
                    {presets.map((preset) => {
                        const config = PRESET_CONFIG[preset.name] || {
                            icon: <span>💡</span>,
                            iconBg: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
                            hoverBorder: 'hover:border-blue-400',
                            hoverBg: 'hover:bg-blue-50/40',
                            shadow: 'hover:shadow-blue-500/10',
                            accentText: 'group-hover:text-blue-600',
                        };

                        return (
                            <div key={preset.name} className="relative group/preset h-full">
                                <button
                                    type="button"
                                    onClick={() => onChange(preset.params)}
                                    title={preset.desc}
                                    className={`w-full h-full min-h-[64px] sm:min-h-[68px] px-4 py-3.5 bg-gray-50/70 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 flex items-center justify-start gap-3 transition-all duration-200 ease-out cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${config.hoverBorder} ${config.hoverBg} ${config.shadow}`}
                                >
                                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 ${config.iconBg}`}>
                                        {config.icon}
                                    </div>
                                    <span className={`text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 transition-colors tracking-tight text-left leading-snug whitespace-normal ${config.accentText}`}>
                                        {preset.name}
                                    </span>
                                </button>
                                {/* Hover tooltip for full description */}
                                <div
                                    role="tooltip"
                                    className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover/preset:block group-focus-within/preset:block z-30 w-max max-w-[240px] sm:max-w-xs px-3.5 py-2 bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-md text-white text-xs font-medium rounded-xl shadow-xl border border-white/10 dark:border-gray-700/60 text-center leading-snug"
                                >
                                    <span>{preset.desc}</span>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Primary Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Initial Investment */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center min-h-[24px]">
                        <label htmlFor="initial-investment" className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-tight">
                            Starting Principal
                        </label>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 font-mono">
                            {formatCurrency(params.initialInvestment, currency)}
                        </span>
                    </div>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm pointer-events-none select-none">
                            {curr.symbol}
                        </span>
                        <input
                            id="initial-investment"
                            type="number"
                            min="0"
                            step={initialStep}
                            value={params.initialInvestment}
                            onChange={(e) => handleNumberChange('initialInvestment', e.target.value)}
                            className="w-full pl-8 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-medium font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={initialMax}
                        step={initialStep}
                        value={Math.min(initialMax, params.initialInvestment)}
                        onChange={(e) => onChange({ initialInvestment: Number(e.target.value) })}
                        aria-label="Initial Investment Slider"
                        className="w-full accent-blue-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                    />
                </div>

                {/* Monthly Contribution */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center min-h-[24px]">
                        <label htmlFor="monthly-contribution" className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-tight">
                            Monthly Contribution
                        </label>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 font-mono">
                            {formatCurrency(params.monthlyContribution, currency)}/mo
                        </span>
                    </div>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm pointer-events-none select-none">
                            {curr.symbol}
                        </span>
                        <input
                            id="monthly-contribution"
                            type="number"
                            min="0"
                            step={monthlyStep}
                            value={params.monthlyContribution}
                            onChange={(e) => handleNumberChange('monthlyContribution', e.target.value)}
                            className="w-full pl-8 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-medium font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={monthlyMax}
                        step={monthlyStep}
                        value={Math.min(monthlyMax, params.monthlyContribution)}
                        onChange={(e) => onChange({ monthlyContribution: Number(e.target.value) })}
                        aria-label="Monthly Contribution Slider"
                        className="w-full accent-blue-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                    />
                </div>

                {/* Annual Return Rate */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center min-h-[24px]">
                        <label htmlFor="annual-return-rate" className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-tight">
                            Annual Return
                        </label>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0 font-mono">
                            {params.annualReturnRate}% / yr
                        </span>
                    </div>
                    <div className="relative">
                        <input
                            id="annual-return-rate"
                            type="number"
                            min="0"
                            max="25"
                            step="0.1"
                            value={params.annualReturnRate}
                            onChange={(e) => handleNumberChange('annualReturnRate', e.target.value)}
                            className="w-full pl-3 pr-8 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-medium font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm pointer-events-none select-none">
                            %
                        </span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="18"
                        step="0.5"
                        value={params.annualReturnRate}
                        onChange={(e) => onChange({ annualReturnRate: Number(e.target.value) })}
                        aria-label="Annual Return Rate Slider"
                        className="w-full accent-emerald-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Conservative (5%)</span>
                        <span>S&P / VN-Index (~8-10%)</span>
                        <span>Aggressive (12%+)</span>
                    </div>
                </div>

                {/* Investment Horizon */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center min-h-[24px]">
                        <label htmlFor="investment-horizon" className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-tight">
                            Investment Horizon
                        </label>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 shrink-0 font-mono">
                            {params.investmentHorizonYears} Years
                        </span>
                    </div>
                    <div className="relative">
                        <input
                            id="investment-horizon"
                            type="number"
                            min="1"
                            max="60"
                            value={params.investmentHorizonYears}
                            onChange={(e) => handleNumberChange('investmentHorizonYears', e.target.value)}
                            className="w-full pl-3 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-medium font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm pointer-events-none select-none">
                            yrs
                        </span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={params.investmentHorizonYears}
                        onChange={(e) => onChange({ investmentHorizonYears: Number(e.target.value) })}
                        aria-label="Investment Horizon Slider"
                        className="w-full accent-purple-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Short (5-10 yrs)</span>
                        <span>Typical (20 yrs)</span>
                        <span>Long (30+ yrs)</span>
                    </div>
                </div>
            </div>

            {/* FIRE Parameters Section */}
            <div className="p-4 bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>🔥</span>
                        <span>FIRE (Retirement) Targets</span>
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Rule of 25 (at 4% SWR)
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Annual Expenses */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center min-h-[24px]">
                            <label htmlFor="annual-expenses" className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-tight">
                                Annual Expenses
                            </label>
                            <span className="text-xs font-bold text-gray-900 dark:text-white shrink-0 font-mono">
                                {formatCurrency(params.annualExpenses, currency)}/yr
                            </span>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold pointer-events-none select-none">
                                {curr.symbol}
                            </span>
                            <input
                                id="annual-expenses"
                                type="number"
                                min="0"
                                step={expenseStep}
                                value={params.annualExpenses}
                                onChange={(e) => handleNumberChange('annualExpenses', e.target.value)}
                                className="w-full pl-7 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>

                    {/* Safe Withdrawal Rate */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center min-h-[24px]">
                            <label htmlFor="safe-withdrawal-rate" className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-tight">
                                Safe Withdrawal Rate
                            </label>
                            <span className="text-xs font-bold text-gray-900 dark:text-white shrink-0 font-mono">
                                {params.safeWithdrawalRate}% ({((100 / Math.max(0.1, params.safeWithdrawalRate))).toFixed(0)}x)
                            </span>
                        </div>
                        <div className="relative">
                            <input
                                id="safe-withdrawal-rate"
                                type="number"
                                min="2"
                                max="8"
                                step="0.25"
                                value={params.safeWithdrawalRate}
                                onChange={(e) => handleNumberChange('safeWithdrawalRate', e.target.value)}
                                className="w-full pl-3 pr-7 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold pointer-events-none select-none">
                                %
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Settings Toggle */}
            <div className="pt-2">
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                    <span>{showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings (Income, Expenses, Inflation)'}</span>
                </button>

                {showAdvanced && (
                    <div className="mt-4 space-y-4 animate-in fade-in">
                        {/* Sub-Tab Navigation Switcher */}
                        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-2xl overflow-x-auto no-scrollbar border border-gray-200/60 dark:border-gray-700/60">
                            <button
                                type="button"
                                onClick={() => setAdvancedTab('stages')}
                                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                    advancedTab === 'stages'
                                        ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <span>🎯</span>
                                <span>Life Stages</span>
                                {params.useCustomSegments && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setAdvancedTab('income')}
                                className={`flex-1 min-w-[125px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                    advancedTab === 'income'
                                        ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <span>💼</span>
                                <span>Income &amp; Growth</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setAdvancedTab('expenses')}
                                className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                    advancedTab === 'expenses'
                                        ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <span>💸</span>
                                <span>Expense Inflation</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setAdvancedTab('assumptions')}
                                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                    advancedTab === 'assumptions'
                                        ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <span>⚙️</span>
                                <span>Assumptions</span>
                            </button>
                        </div>

                        {/* Sub-card 1: Multi-Stage Life Segments */}
                        {advancedTab === 'stages' && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200/80 dark:border-gray-800 space-y-4 animate-in fade-in">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                                            <span>🎯</span>
                                            <span>Multi-Stage Life Segments &amp; Changing Expenses</span>
                                        </h4>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                            Customize age brackets (e.g., 22–30, 30–45, 45–55) to model lifestyle changes and decreasing expenses as children grow up or mortgages end
                                        </p>
                                    </div>
                                    <label htmlFor="use-custom-segments-toggle" className="inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            id="use-custom-segments-toggle"
                                            type="checkbox"
                                            checked={params.useCustomSegments ?? false}
                                            onChange={(e) => onChange({ useCustomSegments: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        <span className="ml-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                            {params.useCustomSegments ? 'Active' : 'Off'}
                                        </span>
                                    </label>
                                </div>

                                {params.useCustomSegments ? (
                                    <div className="space-y-3 pt-1">
                                        {/* Template Presets Bar */}
                                        <div className="flex flex-wrap items-center gap-2 pb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Stage Templates:
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleApplySegmentTemplate('family')}
                                                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                                            >
                                                <span>👨‍👩‍👧 Family &amp; Empty Nest (Decreasing Costs)</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleApplySegmentTemplate('coast')}
                                                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                                            >
                                                <span>🏖️ Early Coast &amp; Downshift</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleApplySegmentTemplate('career')}
                                                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                                            >
                                                <span>🐣 3-Stage Career</span>
                                            </button>
                                        </div>

                                        {/* Segment Cards */}
                                        <div className="space-y-3">
                                            {currentSegments.map((seg, idx) => {
                                                const prevSeg = idx > 0 ? currentSegments[idx - 1] : null;
                                                const isExpenseDrop = prevSeg && seg.monthlyExpenses < prevSeg.monthlyExpenses;
                                                const isIncomeRise = prevSeg && seg.monthlyIncome > prevSeg.monthlyIncome;
                                                const stageSavingsRate = seg.monthlyIncome > 0 ? (seg.monthlyContribution / seg.monthlyIncome) * 100 : 0;

                                                return (
                                                    <div
                                                        key={seg.id || idx}
                                                        className="p-4 bg-white dark:bg-gray-900/90 rounded-2xl border border-gray-200/90 dark:border-gray-700/80 space-y-3.5 shadow-2xs"
                                                    >
                                                        {/* Stage Header */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-gray-100 dark:border-gray-800">
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                                                                    {idx + 1}
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    value={seg.name || ''}
                                                                    placeholder={`Stage ${idx + 1}`}
                                                                    onChange={(e) => handleSegmentChange(idx, { name: e.target.value })}
                                                                    className="text-xs font-bold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-hidden px-1 py-0.5 w-full max-w-xs"
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <span
                                                                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                                                        stageSavingsRate >= 50
                                                                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                                                            : stageSavingsRate >= 25
                                                                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                                                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                                                    }`}
                                                                >
                                                                    Savings: {stageSavingsRate.toFixed(1)}%
                                                                </span>
                                                                {currentSegments.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteSegment(idx)}
                                                                        title="Delete Stage"
                                                                        className="text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                        </svg>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Perfectly Aligned 4-Column Grid */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                                                            {/* Age Range */}
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between items-center min-h-[16px]">
                                                                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap truncate">
                                                                        Age Range (Years)
                                                                    </label>
                                                                    <span className="text-[10px] text-gray-400 font-mono">
                                                                        {Math.max(1, seg.toAge - seg.fromAge + 1)} yrs
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="relative flex-1">
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            max="100"
                                                                            value={seg.fromAge}
                                                                            onChange={(e) => handleSegmentChange(idx, { fromAge: Number(e.target.value) })}
                                                                            placeholder="From"
                                                                            className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono font-semibold text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500 outline-hidden"
                                                                        />
                                                                    </div>
                                                                    <span className="text-xs text-gray-400 font-bold shrink-0">–</span>
                                                                    <div className="relative flex-1">
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            max="100"
                                                                            value={seg.toAge}
                                                                            onChange={(e) => handleSegmentChange(idx, { toAge: Number(e.target.value) })}
                                                                            placeholder="To"
                                                                            className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono font-semibold text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500 outline-hidden"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Monthly Income */}
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between items-center min-h-[16px]">
                                                                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap truncate">
                                                                        Monthly Income
                                                                    </label>
                                                                </div>
                                                                <div className="relative">
                                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold pointer-events-none select-none">
                                                                        {curr.symbol}
                                                                    </span>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        step={incomeStep}
                                                                        value={seg.monthlyIncome}
                                                                        onChange={(e) => handleSegmentChange(idx, { monthlyIncome: Number(e.target.value) })}
                                                                        className="w-full pl-6 pr-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono font-medium text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-2 focus:ring-blue-500 outline-hidden"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Monthly Expenses */}
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between items-center min-h-[16px]">
                                                                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap truncate">
                                                                        Monthly Expenses
                                                                    </label>
                                                                </div>
                                                                <div className="relative">
                                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold pointer-events-none select-none">
                                                                        {curr.symbol}
                                                                    </span>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        step={expenseStep}
                                                                        value={seg.monthlyExpenses}
                                                                        onChange={(e) => handleSegmentChange(idx, { monthlyExpenses: Number(e.target.value) })}
                                                                        className="w-full pl-6 pr-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono font-medium text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-2 focus:ring-rose-500 outline-hidden"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Monthly Contribution */}
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between items-center min-h-[16px]">
                                                                    <label className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap truncate">
                                                                        Monthly Deposit
                                                                    </label>
                                                                </div>
                                                                <div className="relative">
                                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-500 text-xs font-semibold pointer-events-none select-none">
                                                                        {curr.symbol}
                                                                    </span>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        step={monthlyStep}
                                                                        value={seg.monthlyContribution}
                                                                        onChange={(e) => handleSegmentChange(idx, { monthlyContribution: Number(e.target.value) })}
                                                                        className="w-full pl-6 pr-2.5 py-1.5 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-mono font-bold text-blue-600 dark:text-blue-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-2 focus:ring-blue-500 outline-hidden"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Contextual indicators */}
                                                        {isExpenseDrop && (
                                                            <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/50 flex items-center gap-1.5">
                                                                <span>📉</span>
                                                                <span>Expenses decrease by <strong>{formatCurrency(prevSeg.monthlyExpenses - seg.monthlyExpenses, currency)}/mo</strong> (e.g. empty nest / mortgage completion)</span>
                                                            </div>
                                                        )}
                                                        {isIncomeRise && (
                                                            <div className="text-[11px] text-blue-700 dark:text-blue-300 font-medium bg-blue-50/60 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-200/60 dark:border-blue-800/40 flex items-center gap-1.5">
                                                                <span>📈</span>
                                                                <span>Income increases by <strong>+{formatCurrency(seg.monthlyIncome - prevSeg.monthlyIncome, currency)}/mo</strong> (career progression / senior promotions)</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Add Segment Button */}
                                        <button
                                            type="button"
                                            onClick={handleAddSegment}
                                            className="w-full py-2 px-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <span>➕ Add Custom Life Stage Segment</span>
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                        Life Stages are currently turned off. Calculations will use the continuous annual growth rates below. Toggle on to define custom age stages.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Sub-card 2: Income & Career Growth */}
                        {advancedTab === 'income' && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200/80 dark:border-gray-800 space-y-4 animate-in fade-in">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                        <span>💼</span>
                                        <span>Monthly Income &amp; Career Growth</span>
                                    </h4>
                                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                        savingsRate >= 50
                                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                            : savingsRate >= 25
                                            ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                    }`}>
                                        Savings Rate: {savingsRate.toFixed(1)}%
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Monthly Income */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center min-h-[18px]">
                                            <label htmlFor="monthly-income" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                Current Monthly Income
                                            </label>
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                                                {formatCurrency(currentMonthlyIncome, currency)}/mo
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold pointer-events-none select-none">
                                                {curr.symbol}
                                            </span>
                                            <input
                                                id="monthly-income"
                                                type="number"
                                                min="0"
                                                step={incomeStep}
                                                value={currentMonthlyIncome}
                                                onChange={(e) => handleNumberChange('monthlyIncome', e.target.value)}
                                                className="w-full pl-7 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white font-medium font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-2 focus:ring-blue-500 outline-hidden"
                                            />
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={incomeMax}
                                            step={incomeStep}
                                            value={Math.min(incomeMax, currentMonthlyIncome)}
                                            onChange={(e) => onChange({ monthlyIncome: Number(e.target.value) })}
                                            aria-label="Monthly Income Slider"
                                            className="w-full accent-blue-600 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                                        />
                                    </div>

                                    {/* Annual Income Growth Rate */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center min-h-[18px]">
                                            <label htmlFor="income-growth-rate" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                Annual Salary/Income Growth
                                            </label>
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                                                {currentIncomeGrowth}% / yr
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                id="income-growth-rate"
                                                type="number"
                                                min="0"
                                                max="20"
                                                step="0.5"
                                                value={currentIncomeGrowth}
                                                onChange={(e) => handleNumberChange('annualIncomeGrowthRate', e.target.value)}
                                                className="w-full pl-3 pr-7 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white font-medium font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-2 focus:ring-emerald-500 outline-hidden"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold pointer-events-none select-none">
                                                %
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="15"
                                            step="0.5"
                                            value={currentIncomeGrowth}
                                            onChange={(e) => onChange({ annualIncomeGrowthRate: Number(e.target.value) })}
                                            aria-label="Annual Income Growth Slider"
                                            className="w-full accent-emerald-600 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Contextual Career Projections hint */}
                                <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40 text-[11px] text-gray-600 dark:text-gray-300 flex flex-wrap items-center justify-between gap-2">
                                    <span>
                                        💸 <strong>Net Monthly Flow:</strong> {formatCurrency(netCashFlow, currency)}/mo (Income {formatCurrency(currentMonthlyIncome, currency)} − Expenses {formatCurrency(monthlyExpenses, currency)})
                                    </span>
                                    {currentIncomeGrowth > 0 && (
                                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                            📈 In 5 yrs: ~{formatCurrency(currentMonthlyIncome * Math.pow(1 + currentIncomeGrowth / 100, 4), currency, true)}/mo
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Sub-card 3: Dynamic Expense Growth */}
                        {advancedTab === 'expenses' && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200/80 dark:border-gray-800 space-y-3 animate-in fade-in">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                        <span>💸</span>
                                        <span>Expense Evolution &amp; Lifestyle Inflation</span>
                                    </h4>
                                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                                        {formatCurrency(monthlyExpenses, currency)}/mo baseline
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center min-h-[18px]">
                                        <label htmlFor="expense-growth-rate" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                            Annual Expense / Lifestyle Increase Rate
                                        </label>
                                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                                            {currentExpenseGrowth}% / yr
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                        <div className="relative">
                                            <input
                                                id="expense-growth-rate"
                                                type="number"
                                                min="0"
                                                max="15"
                                                step="0.5"
                                                value={currentExpenseGrowth}
                                                onChange={(e) => handleNumberChange('annualExpenseGrowthRate', e.target.value)}
                                                className="w-full pl-3 pr-7 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white font-medium font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-2 focus:ring-rose-500 outline-hidden"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold pointer-events-none select-none">
                                                %
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="12"
                                            step="0.5"
                                            value={currentExpenseGrowth}
                                            onChange={(e) => onChange({ annualExpenseGrowthRate: Number(e.target.value) })}
                                            aria-label="Annual Expense Growth Slider"
                                            className="w-full accent-rose-600 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                        {currentExpenseGrowth > 0
                                            ? `In 10 years, annual expenses will grow from ${formatCurrency(params.annualExpenses, currency)} to ~${formatCurrency(params.annualExpenses * Math.pow(1 + currentExpenseGrowth / 100, 9), currency)}/yr.`
                                            : 'Expenses remain constant across the entire investment timeline.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Sub-card 4: General Assumptions (Age, Inflation, Compounding) */}
                        {advancedTab === 'assumptions' && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200/80 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
                                {/* Current Age */}
                                <div className="space-y-1.5">
                                    <label htmlFor="current-age" className="text-xs font-semibold text-gray-700 dark:text-gray-300 block min-h-[18px]">
                                        Current Age
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="current-age"
                                            type="number"
                                            min="10"
                                            max="100"
                                            value={params.currentAge}
                                            onChange={(e) => handleNumberChange('currentAge', e.target.value)}
                                            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white font-medium font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                </div>

                                {/* Inflation Rate */}
                                <div className="space-y-1.5">
                                    <label htmlFor="inflation-rate" className="text-xs font-semibold text-gray-700 dark:text-gray-300 block min-h-[18px]">
                                        Expected Inflation
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="inflation-rate"
                                            type="number"
                                            min="0"
                                            max="15"
                                            step="0.1"
                                            value={params.inflationRate}
                                            onChange={(e) => handleNumberChange('inflationRate', e.target.value)}
                                            className="w-full pl-3 pr-7 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white font-medium font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold pointer-events-none select-none">
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Compounding Frequency */}
                                <div className="space-y-1.5">
                                    <label htmlFor="compounding-freq" className="text-xs font-semibold text-gray-700 dark:text-gray-300 block min-h-[18px]">
                                        Compounding Frequency
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="compounding-freq"
                                            value={params.compoundingFrequency}
                                            onChange={(e) => onChange({ compoundingFrequency: e.target.value as 'monthly' | 'annually' })}
                                            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white font-medium cursor-pointer"
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="annually">Annually</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Inflation Adjustment Toggle */}
                                <div className="space-y-1.5">
                                    <label htmlFor="inflation-toggle" className="text-xs font-semibold text-gray-700 dark:text-gray-300 block min-h-[18px]">
                                        Inflation Adjustment
                                    </label>
                                    <div className="h-[38px] flex items-center">
                                        <label id="inflation-toggle" className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={params.adjustForInflation}
                                                onChange={(e) => onChange({ adjustForInflation: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                                {params.adjustForInflation ? 'Real Value' : 'Nominal Value'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
