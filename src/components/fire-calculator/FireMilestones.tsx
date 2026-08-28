"use client";

import React from 'react';
import { FireMilestone, CurrencyCode, formatCurrency } from '@/utils/calculator';

interface FireMilestonesProps {
    milestones: FireMilestone[];
    currency: CurrencyCode;
    currentAge: number;
}

export const FireMilestones: React.FC<FireMilestonesProps> = ({
    milestones,
    currency,
}) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-5">
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>🏆</span>
                    <span>Wealth Building &amp; FIRE Milestones</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Key checkpoints on your journey to financial freedom
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {milestones.map((milestone) => {
                    const isCompleted = milestone.achieved;
                    return (
                        <div
                            key={milestone.id}
                            className={`p-4 rounded-2xl border transition-all duration-150 relative overflow-hidden flex flex-col justify-between ${
                                isCompleted
                                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/60 shadow-xs'
                                    : 'bg-gray-50/70 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800'
                            }`}
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                        {milestone.title}
                                    </h4>
                                    {isCompleted ? (
                                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 shrink-0">
                                            {milestone.achievedYear === 0 ? 'Unlocked Now' : `Yr ${milestone.achievedYear} (${milestone.achievedAge}yo)`}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200/80 dark:bg-gray-700 text-gray-600 dark:text-gray-400 shrink-0">
                                            {milestone.progressPercentage.toFixed(0)}%
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                    {milestone.description}
                                </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80">
                                <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                                    <span className="text-gray-500 dark:text-gray-400">Target</span>
                                    <span className="font-bold text-gray-900 dark:text-white font-mono">
                                        {formatCurrency(milestone.targetAmount, currency)}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 rounded-full ${
                                            isCompleted
                                                ? 'bg-emerald-500'
                                                : 'bg-linear-to-r from-blue-500 to-indigo-600'
                                        }`}
                                        style={{ width: `${Math.min(100, Math.max(0, milestone.progressPercentage))}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
