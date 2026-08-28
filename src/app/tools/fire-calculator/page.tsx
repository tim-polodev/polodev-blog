import React from 'react';
import type { Metadata } from 'next';
import { CustomNavbar } from '@/components/CustomNavbar';
import { FireCalculator } from '@/components/fire-calculator/FireCalculator';

export const metadata: Metadata = {
    title: 'FIRE & Compound Interest Calculator | Polodev',
    description:
        'Interactive Compound Interest and Financial Independence Retire Early (FIRE) calculator. Model your wealth growth, safe withdrawal rate, and retirement timeline.',
    keywords: [
        'FIRE calculator',
        'compound interest calculator',
        'financial independence',
        'retire early',
        'savings calculator',
        'investment growth',
    ],
};

export default function FireCalculatorPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            <CustomNavbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28 pb-20">
                <div className="max-w-7xl mx-auto">
                    <FireCalculator />
                </div>
            </main>
        </div>
    );
}
