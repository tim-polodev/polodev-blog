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

export interface LifeStageSegment {
    id: string;
    name?: string;
    fromAge: number;
    toAge: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlyContribution: number;
}

export interface CalculationParams {
    initialInvestment: number;
    monthlyContribution: number;
    monthlyIncome?: number; // Current baseline monthly income
    annualIncomeGrowthRate?: number; // Annual salary/income growth rate (e.g. 3.5 for 3.5%)
    annualExpenses: number; // Baseline annual expenses
    annualExpenseGrowthRate?: number; // Annual lifestyle/expense growth rate (e.g. 2.5 for 2.5%)
    segments?: LifeStageSegment[]; // Optional custom multi-stage age segments for income & expenses
    useCustomSegments?: boolean; // Whether custom life stage segments are active
    annualReturnRate: number; // e.g. 8 for 8%
    investmentHorizonYears: number;
    currentAge: number;
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
    monthlyIncome: number; // Monthly income in this year
    annualIncome: number; // Total annual income in this year
    monthlyExpenses: number; // Monthly expenses in this year
    annualExpenses: number; // Total annual expenses in this year
    fireTargetYear: number; // Target FIRE portfolio needed for this year's expense level
    savingsRateYear: number; // Savings rate percentage for this year
    segmentName?: string; // Optional name of life stage segment
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
        monthlyIncome,
        annualIncomeGrowthRate = 0,
        annualExpenses,
        annualExpenseGrowthRate = 0,
        segments = [],
        useCustomSegments = false,
        annualReturnRate,
        investmentHorizonYears,
        currentAge,
        inflationRate,
        compoundingFrequency,
        safeWithdrawalRate = 4.0,
    } = params;

    const rate = Math.max(0, annualReturnRate) / 100;
    const inflRate = Math.max(0, inflationRate) / 100;
    const incomeGrowth = Math.max(0, annualIncomeGrowthRate) / 100;
    const expenseGrowth = Math.max(0, annualExpenseGrowthRate) / 100;
    const swrFraction = safeWithdrawalRate > 0 ? safeWithdrawalRate / 100 : 0.04;

    const baseMonthlyIncome =
        monthlyIncome !== undefined
            ? Math.max(0, monthlyIncome)
            : Math.max(monthlyContribution * 2, (annualExpenses || 0) / 12);
    const baseAnnualExpenses = Math.max(0, annualExpenses || 0);

    const hasActiveSegments = useCustomSegments && segments.length > 0;

    const yearlySchedule: YearlyData[] = [];

    let currentBalance = Math.max(0, initialInvestment);
    let cumulativeContribution = Math.max(0, initialInvestment);
    let cumulativeInterest = 0;

    for (let year = 1; year <= investmentHorizonYears; year++) {
        const startBalance = currentBalance;
        const currentYearAge = currentAge + year;

        let currentYearMonthlyIncome: number;
        let currentYearAnnualExpenses: number;
        let currentYearMonthlyContribution: number;
        let segmentName: string | undefined;

        if (hasActiveSegments) {
            // Find matching segment by age
            const matchingSegment = segments.find(
                (s) => currentYearAge >= s.fromAge && currentYearAge <= s.toAge
            );

            if (matchingSegment) {
                currentYearMonthlyIncome = Math.max(0, matchingSegment.monthlyIncome);
                currentYearAnnualExpenses = Math.max(0, matchingSegment.monthlyExpenses * 12);
                currentYearMonthlyContribution = Math.max(0, matchingSegment.monthlyContribution);
                segmentName = matchingSegment.name;
            } else {
                // If year falls outside specified segments, fallback smoothly to nearest segment or baseline
                const nearestSegment =
                    segments.length > 0
                        ? currentYearAge < segments[0].fromAge
                            ? segments[0]
                            : segments[segments.length - 1]
                        : undefined;

                currentYearMonthlyIncome = Math.max(0, nearestSegment?.monthlyIncome ?? baseMonthlyIncome);
                currentYearAnnualExpenses = Math.max(0, (nearestSegment?.monthlyExpenses ?? baseAnnualExpenses / 12) * 12);
                currentYearMonthlyContribution = Math.max(0, nearestSegment?.monthlyContribution ?? monthlyContribution);
                segmentName = nearestSegment?.name;
            }
        } else {
            // Dynamic progression with growth rates
            const incomeFactor = Math.pow(1 + incomeGrowth, year - 1);
            const expenseFactor = Math.pow(1 + expenseGrowth, year - 1);

            currentYearMonthlyIncome = baseMonthlyIncome * incomeFactor;
            currentYearAnnualExpenses = baseAnnualExpenses * expenseFactor;
            currentYearMonthlyContribution = monthlyContribution * incomeFactor;
        }

        const currentYearAnnualIncome = currentYearMonthlyIncome * 12;
        const currentYearMonthlyExpenses = currentYearAnnualExpenses / 12;

        let yearlyContribution = 0;
        let interestThisYear = 0;

        if (compoundingFrequency === 'monthly') {
            const monthlyRate = rate / 12;
            for (let m = 1; m <= 12; m++) {
                currentBalance += currentYearMonthlyContribution;
                yearlyContribution += currentYearMonthlyContribution;
                const monthlyInterest = currentBalance * monthlyRate;
                interestThisYear += monthlyInterest;
                currentBalance += monthlyInterest;
            }
        } else {
            // Annual compounding
            yearlyContribution = currentYearMonthlyContribution * 12;
            currentBalance += yearlyContribution;
            interestThisYear = currentBalance * rate;
            currentBalance += interestThisYear;
        }

        cumulativeContribution += yearlyContribution;
        cumulativeInterest += interestThisYear;

        // Inflation discount factor: (1 + inflRate)^year
        const inflationFactor = Math.pow(1 + inflRate, year);
        const realEndBalance = inflationFactor > 0 ? currentBalance / inflationFactor : currentBalance;

        // Dynamic FIRE target for this year's expense level
        const fireTargetYear = currentYearAnnualExpenses > 0 ? currentYearAnnualExpenses / swrFraction : 0;
        const savingsRateYear =
            currentYearMonthlyIncome > 0
                ? Math.min(100, Math.max(0, (currentYearMonthlyContribution / currentYearMonthlyIncome) * 100))
                : 0;

        yearlySchedule.push({
            year,
            age: currentYearAge,
            startBalance,
            annualContribution: yearlyContribution,
            totalContributed: cumulativeContribution,
            interestEarnedYear: interestThisYear,
            totalInterestEarned: cumulativeInterest,
            endBalance: currentBalance,
            realEndBalance,
            monthlyIncome: currentYearMonthlyIncome,
            annualIncome: currentYearAnnualIncome,
            monthlyExpenses: currentYearMonthlyExpenses,
            annualExpenses: currentYearAnnualExpenses,
            fireTargetYear,
            savingsRateYear,
            segmentName,
        });
    }

    return yearlySchedule;
}

export function getDefaultSegmentsVND(currentAge: number = 25): LifeStageSegment[] {
    return [
        {
            id: 'early_career',
            name: 'Early Career & Single',
            fromAge: Math.min(currentAge, 22),
            toAge: 30,
            monthlyIncome: 25_000_000,
            monthlyExpenses: 14_000_000,
            monthlyContribution: 11_000_000,
        },
        {
            id: 'family_kids',
            name: 'Family & Raising Children (Peak Costs)',
            fromAge: 31,
            toAge: 45,
            monthlyIncome: 65_000_000,
            monthlyExpenses: 38_000_000,
            monthlyContribution: 27_000_000,
        },
        {
            id: 'empty_nest',
            name: 'Peak Career & Empty Nest (Costs Drop)',
            fromAge: 46,
            toAge: 55,
            monthlyIncome: 90_000_000,
            monthlyExpenses: 25_000_000,
            monthlyContribution: 65_000_000,
        },
        {
            id: 'slowdown',
            name: 'Pre-Retirement / Coasting',
            fromAge: 56,
            toAge: 70,
            monthlyIncome: 40_000_000,
            monthlyExpenses: 20_000_000,
            monthlyContribution: 20_000_000,
        },
    ];
}

export function getDefaultSegmentsUSD(currentAge: number = 25): LifeStageSegment[] {
    return [
        {
            id: 'early_career',
            name: 'Early Career Foundation',
            fromAge: Math.min(currentAge, 22),
            toAge: 30,
            monthlyIncome: 4_000,
            monthlyExpenses: 2_500,
            monthlyContribution: 1_500,
        },
        {
            id: 'family_kids',
            name: 'Family & Kids / Mortgage (Peak Costs)',
            fromAge: 31,
            toAge: 45,
            monthlyIncome: 9_000,
            monthlyExpenses: 5_500,
            monthlyContribution: 3_500,
        },
        {
            id: 'empty_nest',
            name: 'Peak Earnings & Empty Nest (Costs Drop)',
            fromAge: 46,
            toAge: 55,
            monthlyIncome: 12_000,
            monthlyExpenses: 3_800,
            monthlyContribution: 8_200,
        },
        {
            id: 'slowdown',
            name: 'Pre-Retirement / Coasting',
            fromAge: 56,
            toAge: 70,
            monthlyIncome: 5_000,
            monthlyExpenses: 3_000,
            monthlyContribution: 2_000,
        },
    ];
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

    const initialFireTarget = schedule[0]?.fireTargetYear > 0 ? schedule[0].fireTargetYear : fireNumber;

    if (params.initialInvestment >= initialFireTarget && initialFireTarget > 0) {
        yearsToFire = 0;
        fireAge = currentAge;
        fireAchieved = true;
    } else {
        for (const row of schedule) {
            const balanceToCheck = adjustForInflation ? row.realEndBalance : row.endBalance;
            const targetToCheck = row.fireTargetYear > 0 ? row.fireTargetYear : fireNumber;
            if (balanceToCheck >= targetToCheck && targetToCheck > 0) {
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
