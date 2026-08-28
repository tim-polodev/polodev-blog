export type CurrencyCode = 'VND' | 'USD';

export interface CurrencyConfig {
    code: CurrencyCode;
    symbol: string;
    label: string;
    locale: string;
    decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
    VND: { code: 'VND', symbol: '₫', label: 'VND (₫)', locale: 'vi-VN', decimals: 0 },
    USD: { code: 'USD', symbol: '$', label: 'USD ($)', locale: 'en-US', decimals: 0 },
};

export interface CalculationParams {
    initialInvestment: number;
    monthlyContribution: number;
    annualReturnRate: number; // e.g. 8 for 8%
    investmentHorizonYears: number;
    currentAge: number;
    annualExpenses: number;
    safeWithdrawalRate: number; // e.g. 4 for 4%
    inflationRate: number; // e.g. 3.5 for 3.5%
    adjustForInflation: boolean;
    compoundingFrequency: 'monthly' | 'annually';
}

export interface YearlyData {
    year: number;
    age: number;
    startBalance: number;
    annualContribution: number;
    totalContributed: number;
    interestEarnedYear: number;
    totalInterestEarned: number;
    endBalance: number;
    realEndBalance: number; // Inflation-adjusted
}

export interface FireMilestone {
    id: string;
    title: string;
    description: string;
    targetAmount: number;
    achieved: boolean;
    achievedYear?: number;
    achievedAge?: number;
    progressPercentage: number;
}

export interface FireMetrics {
    finalBalance: number;
    totalPrincipalContributed: number;
    totalInterestEarned: number;
    fireNumber: number;
    leanFireNumber: number;
    fatFireNumber: number;
    coastFireNumber: number;
    yearsToFire: number | null;
    fireAge: number | null;
    fireAchieved: boolean;
    monthlyPassiveIncome: number;
    realFinalBalance: number;
    milestones: FireMilestone[];
}

/**
 * Format a numeric amount based on chosen currency configuration
 */
export function formatCurrency(
    amount: number,
    currencyCode: CurrencyCode = 'VND',
    compact = false
): string {
    const config = CURRENCIES[currencyCode] || CURRENCIES.VND;
    if (isNaN(amount)) return `${config.symbol}0`;

    if (compact) {
        if (currencyCode === 'VND') {
            if (Math.abs(amount) >= 1_000_000_000) {
                return `${(amount / 1_000_000_000).toFixed(1)}B ₫`;
            }
            if (Math.abs(amount) >= 1_000_000) {
                return `${(amount / 1_000_000).toFixed(1)}M ₫`;
            }
            if (Math.abs(amount) >= 1_000) {
                return `${(amount / 1_000).toFixed(0)}k ₫`;
            }
        } else {
            if (Math.abs(amount) >= 1_000_000) {
                return new Intl.NumberFormat(config.locale, {
                    style: 'currency',
                    currency: config.code,
                    notation: 'compact',
                    maximumFractionDigits: 1,
                }).format(amount);
            }
        }
    }

    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.code,
        maximumFractionDigits: config.decimals,
        minimumFractionDigits: config.decimals,
    }).format(amount);
}

/**
 * Calculate year-by-year compound interest growth schedule
 */
export function calculateCompoundInterest(params: CalculationParams): YearlyData[] {
    const {
        initialInvestment,
        monthlyContribution,
        annualReturnRate,
        investmentHorizonYears,
        currentAge,
        inflationRate,
        compoundingFrequency,
    } = params;

    const rate = Math.max(0, annualReturnRate) / 100;
    const inflRate = Math.max(0, inflationRate) / 100;
    const yearlySchedule: YearlyData[] = [];

    let currentBalance = Math.max(0, initialInvestment);
    let cumulativeContribution = Math.max(0, initialInvestment);
    let cumulativeInterest = 0;

    for (let year = 1; year <= investmentHorizonYears; year++) {
        const startBalance = currentBalance;
        let yearlyContribution = 0;
        let interestThisYear = 0;

        if (compoundingFrequency === 'monthly') {
            const monthlyRate = rate / 12;
            for (let m = 1; m <= 12; m++) {
                currentBalance += monthlyContribution;
                yearlyContribution += monthlyContribution;
                const monthlyInterest = currentBalance * monthlyRate;
                interestThisYear += monthlyInterest;
                currentBalance += monthlyInterest;
            }
        } else {
            // Annual compounding
            yearlyContribution = monthlyContribution * 12;
            currentBalance += yearlyContribution;
            interestThisYear = currentBalance * rate;
            currentBalance += interestThisYear;
        }

        cumulativeContribution += yearlyContribution;
        cumulativeInterest += interestThisYear;

        // Inflation discount factor: (1 + inflRate)^year
        const inflationFactor = Math.pow(1 + inflRate, year);
        const realEndBalance = inflationFactor > 0 ? currentBalance / inflationFactor : currentBalance;

        yearlySchedule.push({
            year,
            age: currentAge + year,
            startBalance,
            annualContribution: yearlyContribution,
            totalContributed: cumulativeContribution,
            interestEarnedYear: interestThisYear,
            totalInterestEarned: cumulativeInterest,
            endBalance: currentBalance,
            realEndBalance,
        });
    }

    return yearlySchedule;
}

/**
 * Calculate FIRE target numbers, time to FIRE, and milestone progress
 */
export function calculateFireMetrics(
    params: CalculationParams,
    schedule: YearlyData[],
    currencyCode: CurrencyCode = 'VND'
): FireMetrics {
    const {
        annualExpenses,
        safeWithdrawalRate,
        currentAge,
        investmentHorizonYears,
        annualReturnRate,
        inflationRate,
        adjustForInflation,
    } = params;

    const swrFraction = safeWithdrawalRate > 0 ? safeWithdrawalRate / 100 : 0.04;
    const fireNumber = annualExpenses > 0 ? annualExpenses / swrFraction : 0;
    const leanFireNumber = fireNumber * 0.75;
    const fatFireNumber = fireNumber * 1.35;

    // Coast FIRE: Amount needed now such that with no further contributions it grows to FIRE number at horizon
    const effectiveRate = Math.max(0, annualReturnRate - (adjustForInflation ? inflationRate : 0)) / 100;
    const coastFireNumber =
        investmentHorizonYears > 0 && effectiveRate > 0
            ? fireNumber / Math.pow(1 + effectiveRate, investmentHorizonYears)
            : fireNumber;

    const finalRow = schedule[schedule.length - 1];
    const finalBalance = finalRow ? (adjustForInflation ? finalRow.realEndBalance : finalRow.endBalance) : params.initialInvestment;
    const totalPrincipalContributed = finalRow ? finalRow.totalContributed : params.initialInvestment;
    const totalInterestEarned = finalRow ? finalRow.totalInterestEarned : 0;
    const realFinalBalance = finalRow ? finalRow.realEndBalance : params.initialInvestment;

    // Find year and age when FIRE is reached
    let yearsToFire: number | null = null;
    let fireAge: number | null = null;
    let fireAchieved = false;

    if (params.initialInvestment >= fireNumber && fireNumber > 0) {
        yearsToFire = 0;
        fireAge = currentAge;
        fireAchieved = true;
    } else {
        for (const row of schedule) {
            const balanceToCheck = adjustForInflation ? row.realEndBalance : row.endBalance;
            if (balanceToCheck >= fireNumber && fireNumber > 0) {
                yearsToFire = row.year;
                fireAge = row.age;
                fireAchieved = true;
                break;
            }
        }
    }

    // Monthly passive income at SWR from final balance
    const monthlyPassiveIncome = (finalBalance * swrFraction) / 12;

    // Milestones definition depending on currency
    const milestoneDefinitions = currencyCode === 'VND'
        ? [
            { id: 'first_100m', title: 'First 100 Million (₫100M)', desc: 'The foundational milestone in wealth accumulation', amount: 100_000_000 },
            { id: 'coast_fire', title: 'Coast FIRE', desc: 'Invested enough to stop saving and let compounding fund retirement', amount: coastFireNumber },
            { id: 'first_1b', title: 'First 1 Billion (₫1B)', desc: 'Compounding returns begin to surpass annual contributions', amount: 1_000_000_000 },
            { id: 'lean_fire', title: 'Lean FIRE (75% Expenses)', desc: 'Covers essential basic living expenses', amount: leanFireNumber },
            { id: 'full_fire', title: 'Traditional FIRE (100% Expenses)', desc: 'Complete financial independence at current lifestyle', amount: fireNumber },
            { id: 'fat_fire', title: 'Fat FIRE (135% Expenses)', desc: 'Abundant retirement with luxury and generous safety buffer', amount: fatFireNumber },
        ]
        : [
            { id: 'first_100k', title: 'First $100k', desc: 'The hardest milestone in wealth building', amount: 100_000 },
            { id: 'coast_fire', title: 'Coast FIRE', desc: 'Invested enough to stop saving and let compounding retire you', amount: coastFireNumber },
            { id: 'first_500k', title: 'Half Million', desc: 'Compounding returns often exceed annual contributions', amount: 500_000 },
            { id: 'lean_fire', title: 'Lean FIRE (75% Expenses)', desc: 'Covers essential living expenses', amount: leanFireNumber },
            { id: 'full_fire', title: 'Traditional FIRE (100% Expenses)', desc: 'Complete financial independence at current lifestyle', amount: fireNumber },
            { id: 'fat_fire', title: 'Fat FIRE (135% Expenses)', desc: 'Abundant retirement with luxury and generous travel buffer', amount: fatFireNumber },
        ];

    const milestones: FireMilestone[] = milestoneDefinitions.map((def) => {
        let achieved = false;
        let achievedYear: number | undefined;
        let achievedAge: number | undefined;

        if (params.initialInvestment >= def.amount && def.amount > 0) {
            achieved = true;
            achievedYear = 0;
            achievedAge = currentAge;
        } else {
            for (const row of schedule) {
                const bal = adjustForInflation ? row.realEndBalance : row.endBalance;
                if (bal >= def.amount && def.amount > 0) {
                    achieved = true;
                    achievedYear = row.year;
                    achievedAge = row.age;
                    break;
                }
            }
        }

        const progressPercentage = def.amount > 0 ? Math.min(100, Math.max(0, (finalBalance / def.amount) * 100)) : 100;

        return {
            id: def.id,
            title: def.title,
            description: def.desc,
            targetAmount: def.amount,
            achieved,
            achievedYear,
            achievedAge,
            progressPercentage,
        };
    });

    return {
        finalBalance,
        totalPrincipalContributed,
        totalInterestEarned,
        fireNumber,
        leanFireNumber,
        fatFireNumber,
        coastFireNumber,
        yearsToFire,
        fireAge,
        fireAchieved,
        monthlyPassiveIncome,
        realFinalBalance,
        milestones,
    };
}
