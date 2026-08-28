"use client";

import React, { useState } from 'react';
import { CalculationParams, CurrencyCode, CURRENCIES, formatCurrency } from '@/utils/calculator';

interface CalculatorFormProps {
    params: CalculationParams;
    onChange: (updated: Partial<CalculationParams>) => void;
    currency: CurrencyCode;
    onCurrencyChange: (currency: CurrencyCode) => void;
}

export const PRESETS_VND = [
    {
        name: 'Standard FIRE',
        desc: 'Target 25x annual expenses at 8% return',
        params: {
            initialInvestment: 100_000_000,
            monthlyContribution: 15_000_000,
            annualReturnRate: 8.0,
            investmentHorizonYears: 20,
            currentAge: 28,
            annualExpenses: 240_000_000,
            safeWithdrawalRate: 4.0,
            inflationRate: 3.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
    {
        name: 'Aggressive Saver',
        desc: 'High savings rate & 12-year fast track',
        params: {
            initialInvestment: 250_000_000,
            monthlyContribution: 35_000_000,
            annualReturnRate: 9.0,
            investmentHorizonYears: 12,
            currentAge: 30,
            annualExpenses: 360_000_000,
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
            annualReturnRate: 8.0,
            investmentHorizonYears: 25,
            currentAge: 32,
            annualExpenses: 240_000_000,
            safeWithdrawalRate: 3.75,
            inflationRate: 3.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
    {
        name: 'Young Starter',
        desc: 'Start small with a long runway',
        params: {
            initialInvestment: 20_000_000,
            monthlyContribution: 5_000_000,
            annualReturnRate: 8.5,
            investmentHorizonYears: 30,
            currentAge: 22,
            annualExpenses: 180_000_000,
            safeWithdrawalRate: 4.0,
            inflationRate: 3.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
];

export const PRESETS_USD = [
    {
        name: 'Standard FIRE',
        desc: 'Steady 4% rule compounding',
        params: {
            initialInvestment: 25000,
            monthlyContribution: 1500,
            annualReturnRate: 8.0,
            investmentHorizonYears: 20,
            currentAge: 28,
            annualExpenses: 48000,
            safeWithdrawalRate: 4.0,
            inflationRate: 2.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
    {
        name: 'Aggressive Saver',
        desc: 'High savings rate & fast track',
        params: {
            initialInvestment: 50000,
            monthlyContribution: 3500,
            annualReturnRate: 9.0,
            investmentHorizonYears: 12,
            currentAge: 30,
            annualExpenses: 60000,
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
            annualReturnRate: 8.0,
            investmentHorizonYears: 25,
            currentAge: 32,
            annualExpenses: 45000,
            safeWithdrawalRate: 3.75,
            inflationRate: 2.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly' as const,
        },
    },
    {
        name: 'Young Starter',
        desc: 'Start small with massive runway',
        params: {
            initialInvestment: 5000,
            monthlyContribution: 600,
            annualReturnRate: 8.5,
            investmentHorizonYears: 35,
            currentAge: 22,
            annualExpenses: 36000,
            safeWithdrawalRate: 4.0,
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
    const curr = CURRENCIES[currency] || CURRENCIES.VND;
    const presets = currency === 'VND' ? PRESETS_VND : PRESETS_USD;

    const isVND = currency === 'VND';
    const initialMax = isVND ? 5_000_000_000 : 500_000;
    const initialStep = isVND ? 10_000_000 : 5_000;
    const monthlyMax = isVND ? 100_000_000 : 15_000;
    const monthlyStep = isVND ? 1_000_000 : 100;
    const expenseStep = isVND ? 5_000_000 : 1_000;

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
                    <span>{showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings (Inflation, Age, Compounding)'}</span>
                </button>

                {showAdvanced && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200/80 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
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
        </div>
    );
};
