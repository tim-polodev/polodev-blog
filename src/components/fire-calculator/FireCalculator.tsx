"use client";

import React, { useState, useMemo } from 'react';
import {
    CalculationParams,
    CurrencyCode,
    calculateCompoundInterest,
    calculateFireMetrics,
} from '@/utils/calculator';
import { MetricCards } from './MetricCards';
import { CalculatorForm } from './CalculatorForm';
import { GrowthChart } from './GrowthChart';
import { YearlyBreakdownTable } from './YearlyBreakdownTable';
import { FireMilestones } from './FireMilestones';

const DEFAULT_PARAMS_VND: CalculationParams = {
    initialInvestment: 100_000_000,
    monthlyContribution: 15_000_000,
    annualReturnRate: 8.0,
    investmentHorizonYears: 20,
    currentAge: 28,
    annualExpenses: 240_000_000,
    safeWithdrawalRate: 4.0,
    inflationRate: 3.5,
    adjustForInflation: false,
    compoundingFrequency: 'monthly',
};

type ActiveTab = 'chart' | 'schedule' | 'milestones' | 'guide';

export const FireCalculator: React.FC = () => {
    const [currency, setCurrency] = useState<CurrencyCode>('VND');
    const [params, setParams] = useState<CalculationParams>(DEFAULT_PARAMS_VND);
    const [activeTab, setActiveTab] = useState<ActiveTab>('chart');

    const handleParamChange = (updated: Partial<CalculationParams>) => {
        setParams((prev) => ({ ...prev, ...updated }));
    };

    // Calculate schedule and metrics memoized
    const yearlySchedule = useMemo(() => {
        return calculateCompoundInterest(params);
    }, [params]);

    const fireMetrics = useMemo(() => {
        return calculateFireMetrics(params, yearlySchedule, currency);
    }, [params, yearlySchedule, currency]);

    return (
        <div className="space-y-8">
            {/* Header / Intro */}
            <div className="text-center max-w-3xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    <span>💡 Financial Independence Tool</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                    Compound Interest &amp; FIRE Calculator
                </h1>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Plan your path to financial freedom. Simulate exponential investment growth, project your retirement timeline, and calculate your target FIRE number.
                </p>
            </div>

            {/* Top Metric Cards */}
            <MetricCards
                metrics={fireMetrics}
                currency={currency}
                horizonYears={params.investmentHorizonYears}
                adjustForInflation={params.adjustForInflation}
            />

            {/* Main Interactive Grid: Left Form, Right Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Inputs Form */}
                <div className="lg:col-span-5">
                    <CalculatorForm
                        params={params}
                        onChange={handleParamChange}
                        currency={currency}
                        onCurrencyChange={setCurrency}
                    />
                </div>

                {/* Right Visualizations & Analytics */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200 dark:border-gray-800 gap-2 overflow-x-auto pb-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('chart')}
                            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                activeTab === 'chart'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            <span>📊 Growth Chart</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('schedule')}
                            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                activeTab === 'schedule'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            <span>📋 Amortization Schedule</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('milestones')}
                            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                activeTab === 'milestones'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            <span>🏆 Milestones</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('guide')}
                            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                activeTab === 'guide'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            <span>📖 FIRE Guide</span>
                        </button>
                    </div>

                    {/* Tab Views */}
                    {activeTab === 'chart' && (
                        <GrowthChart
                            data={yearlySchedule}
                            initialInvestment={params.initialInvestment}
                            fireNumber={fireMetrics.fireNumber}
                            currency={currency}
                            currentAge={params.currentAge}
                            adjustForInflation={params.adjustForInflation}
                        />
                    )}

                    {activeTab === 'schedule' && (
                        <YearlyBreakdownTable
                            data={yearlySchedule}
                            currency={currency}
                            fireNumber={fireMetrics.fireNumber}
                            adjustForInflation={params.adjustForInflation}
                        />
                    )}

                    {activeTab === 'milestones' && (
                        <FireMilestones
                            milestones={fireMetrics.milestones}
                            currency={currency}
                            currentAge={params.currentAge}
                        />
                    )}

                    {activeTab === 'guide' && (
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-6 text-sm">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Understanding Compound Interest &amp; FIRE
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    FIRE stands for Financial Independence, Retire Early. The movement is rooted in spending mindfully, investing aggressively, and letting the exponential power of compounding generate sustainable passive income.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                                        📌 The 4% Rule (Rule of 25)
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Based on the Trinity Study, withdrawing 4% of your portfolio each year (adjusted for inflation) offers a high historical probability of not depleting wealth over a 30-year retirement. Target FIRE number = Annual Spending × 25.
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                                        ⛵ Coast FIRE
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        You have invested enough money early in life that without contributing another penny, your existing investments will compound on their own to fully fund your retirement by your target age.
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                                        🥣 Lean FIRE
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Living on a minimalist budget covering only essential expenses (typically 70-80% of standard living costs). Faster to achieve with lower required net worth.
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                                        🏖️ Fat FIRE
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Retiring with an abundance mindset, luxury travel, and a comfortable financial cushion (typically 130-150%+ of average living expenses).
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
