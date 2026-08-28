"use client";

import React from 'react';
import { FireMetrics, CurrencyCode, formatCurrency } from '@/utils/calculator';

interface MetricCardsProps {
    metrics: FireMetrics;
    currency: CurrencyCode;
    horizonYears: number;
    adjustForInflation: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
    metrics,
    currency,
    horizonYears,
    adjustForInflation,
}) => {
    const {
        finalBalance,
        totalPrincipalContributed,
        totalInterestEarned,
        fireNumber,
        yearsToFire,
        fireAge,
        fireAchieved,
        monthlyPassiveIncome,
    } = metrics;

    const interestRatio = finalBalance > 0 ? (totalInterestEarned / finalBalance) * 100 : 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Projected Portfolio Value */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50/50 dark:from-gray-900 dark:to-indigo-950/40 p-5 border border-blue-200/60 dark:border-indigo-900/50 shadow-xs">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        In {horizonYears} Years
                    </span>
                    <span className="text-xl">💰</span>
                </div>
                <div className="mt-2">
                    <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {formatCurrency(finalBalance, currency)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {adjustForInflation ? 'Inflation-adjusted (real value)' : 'Nominal future value'}
                    </p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                    <span>✨ Interest share:</span>
                    <span className="font-bold">{interestRatio.toFixed(1)}%</span>
                </div>
            </div>

            {/* Total Interest Growth */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50/50 dark:from-gray-900 dark:to-emerald-950/40 p-5 border border-emerald-200/60 dark:border-emerald-900/50 shadow-xs">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Compound Growth
                    </span>
                    <span className="text-xl">📈</span>
                </div>
                <div className="mt-2">
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                        +{formatCurrency(totalInterestEarned, currency)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        From {formatCurrency(totalPrincipalContributed, currency)} principal
                    </p>
                </div>
                <div className="mt-3 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    <span>Free money from compounding interest</span>
                </div>
            </div>

            {/* FIRE Target Number */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-purple-50 to-pink-50/50 dark:from-gray-900 dark:to-purple-950/40 p-5 border border-purple-200/60 dark:border-purple-900/50 shadow-xs">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        FIRE Target (SWR)
                    </span>
                    <span className="text-xl">🎯</span>
                </div>
                <div className="mt-2">
                    <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
                        {formatCurrency(fireNumber, currency)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Safe Withdrawal Target
                    </p>
                </div>
                <div className="mt-3 text-xs text-purple-700 dark:text-purple-300 font-medium">
                    <span>Produces {formatCurrency(monthlyPassiveIncome, currency)}/mo</span>
                </div>
            </div>

            {/* Financial Freedom Status / Time to FIRE */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-50 to-orange-50/50 dark:from-gray-900 dark:to-amber-950/40 p-5 border border-amber-200/60 dark:border-amber-900/50 shadow-xs">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Time to FIRE
                    </span>
                    <span className="text-xl">🚀</span>
                </div>
                <div className="mt-2">
                    {fireAchieved ? (
                        <>
                            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                                {yearsToFire === 0 ? 'Achieved Now' : `${yearsToFire} Years`}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {fireAge ? `Reach freedom at age ${fireAge}` : 'Target reached within horizon'}
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="text-2xl sm:text-3xl font-extrabold text-gray-700 dark:text-gray-300 tracking-tight">
                                &gt; {horizonYears} Years
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Increase contributions or time horizon
                            </p>
                        </>
                    )}
                </div>
                <div className="mt-3 text-xs text-amber-700 dark:text-amber-300 font-medium">
                    {fireAchieved ? '🎉 Financial Independence on track!' : '💡 Adjust rates or savings to hit target sooner'}
                </div>
            </div>
        </div>
    );
};
