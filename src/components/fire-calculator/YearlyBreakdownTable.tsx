"use client";

import React, { useState } from 'react';
import { YearlyData, CurrencyCode, formatCurrency } from '@/utils/calculator';

interface YearlyBreakdownTableProps {
    data: YearlyData[];
    currency: CurrencyCode;
    fireNumber: number;
    adjustForInflation: boolean;
}

export const YearlyBreakdownTable: React.FC<YearlyBreakdownTableProps> = ({
    data,
    currency,
    fireNumber,
    adjustForInflation,
}) => {
    const [showAll, setShowAll] = useState(false);
    const [copied, setCopied] = useState(false);

    const displayedData = showAll ? data : data.slice(0, 10);

    const handleExportCSV = () => {
        const headers = [
            'Year',
            'Age',
            'Start Balance',
            'Annual Contribution',
            'Total Contributed',
            'Interest Earned (Year)',
            'Total Interest Earned',
            'End Balance (Nominal)',
            'End Balance (Real / Inflation Adjusted)',
        ];

        const rows = data.map((d) => [
            d.year,
            d.age,
            d.startBalance.toFixed(2),
            d.annualContribution.toFixed(2),
            d.totalContributed.toFixed(2),
            d.interestEarnedYear.toFixed(2),
            d.totalInterestEarned.toFixed(2),
            d.endBalance.toFixed(2),
            d.realEndBalance.toFixed(2),
        ]);

        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `polodev_fire_schedule_${data.length}years.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopySummary = () => {
        const lastRow = data[data.length - 1];
        if (!lastRow) return;

        const summaryText = `FIRE & Compound Interest Schedule (${data.length} Years):\n` +
            `Final Balance: ${formatCurrency(lastRow.endBalance, currency)}\n` +
            `Total Contributed: ${formatCurrency(lastRow.totalContributed, currency)}\n` +
            `Total Interest: ${formatCurrency(lastRow.totalInterestEarned, currency)}\n` +
            `Real Value: ${formatCurrency(lastRow.realEndBalance, currency)}`;

        navigator.clipboard.writeText(summaryText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-4">
            {/* Header & Export actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>📋</span>
                        <span>Annual Amortization Schedule</span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Year-by-year detailed breakdown of compounding balance and contributions
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleCopySummary}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5"
                    >
                        <span>{copied ? '✅ Copied' : '📄 Copy Summary'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                        <span>📥 Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 dark:bg-gray-800/70 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="py-3 px-3.5">Year</th>
                            <th className="py-3 px-3">Age</th>
                            <th className="py-3 px-3">Start Balance</th>
                            <th className="py-3 px-3">Annual Deposit</th>
                            <th className="py-3 px-3 text-emerald-600 dark:text-emerald-400">Interest (Yr)</th>
                            <th className="py-3 px-3">Total Invested</th>
                            <th className="py-3 px-3.5 text-right font-bold text-gray-900 dark:text-white">
                                {adjustForInflation ? 'Real Ending Balance' : 'Ending Balance'}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-mono">
                        {displayedData.map((row) => {
                            const isFireYear =
                                fireNumber > 0 &&
                                (adjustForInflation ? row.realEndBalance : row.endBalance) >= fireNumber &&
                                (row.year === 1 ||
                                    (adjustForInflation
                                        ? (data[row.year - 2]?.realEndBalance ?? 0) < fireNumber
                                        : (data[row.year - 2]?.endBalance ?? 0) < fireNumber));

                            return (
                                <tr
                                    key={row.year}
                                    className={`hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors ${
                                        isFireYear
                                            ? 'bg-purple-50/60 dark:bg-purple-950/30 border-l-4 border-l-purple-500'
                                            : ''
                                    }`}
                                >
                                    <td className="py-2.5 px-3.5 font-sans font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                                        <span>Yr {row.year}</span>
                                        {isFireYear && (
                                            <span className="text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded-full font-bold">
                                                FIRE 🎯
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-2.5 px-3 font-sans text-gray-500 dark:text-gray-400">
                                        {row.age}
                                    </td>
                                    <td className="py-2.5 px-3 text-gray-600 dark:text-gray-300">
                                        {formatCurrency(row.startBalance, currency)}
                                    </td>
                                    <td className="py-2.5 px-3 text-blue-600 dark:text-blue-400 font-medium">
                                        +{formatCurrency(row.annualContribution, currency)}
                                    </td>
                                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-medium">
                                        +{formatCurrency(row.interestEarnedYear, currency)}
                                    </td>
                                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                                        {formatCurrency(row.totalContributed, currency)}
                                    </td>
                                    <td className="py-2.5 px-3.5 text-right font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(
                                            adjustForInflation ? row.realEndBalance : row.endBalance,
                                            currency
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Expand / Collapse Button */}
            {data.length > 10 && (
                <div className="pt-1 text-center">
                    <button
                        type="button"
                        onClick={() => setShowAll(!showAll)}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-1.5 px-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 transition-colors"
                    >
                        {showAll ? 'Show First 10 Years' : `View All ${data.length} Years (${data.length - 10} more)`}
                    </button>
                </div>
            )}
        </div>
    );
};
