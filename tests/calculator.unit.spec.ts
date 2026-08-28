import { test, expect } from '@playwright/test';
import {
    formatCurrency,
    calculateCompoundInterest,
    calculateFireMetrics,
    CalculationParams,
} from '@/utils/calculator';

test.describe('Calculator Unit Tests - formatCurrency', () => {
    test('formats VND without compact notation correctly', () => {
        const formatted = formatCurrency(100_000_000, 'VND', false);
        // vi-VN format uses non-breaking space and currency symbol
        expect(formatted).toMatch(/100\.000\.000/);
        expect(formatted).toContain('₫');
    });

    test('formats USD without compact notation correctly', () => {
        const formatted = formatCurrency(25000, 'USD', false);
        expect(formatted).toContain('$25,000');
    });

    test('formats compact VND values (k, M, B)', () => {
        expect(formatCurrency(500_000, 'VND', true)).toBe('500k ₫');
        expect(formatCurrency(15_000_000, 'VND', true)).toBe('15.0M ₫');
        expect(formatCurrency(2_500_000_000, 'VND', true)).toBe('2.5B ₫');
    });

    test('formats compact USD values', () => {
        const formattedM = formatCurrency(1_500_000, 'USD', true);
        expect(formattedM).toContain('$1.5M');

        const formattedUnderM = formatCurrency(50_000, 'USD', true);
        expect(formattedUnderM).toContain('$50,000');
    });

    test('handles edge cases (NaN, 0, negative numbers)', () => {
        expect(formatCurrency(NaN, 'VND')).toBe('₫0');
        expect(formatCurrency(NaN, 'USD')).toBe('$0');
        expect(formatCurrency(0, 'VND')).toMatch(/0.*₫/);
        expect(formatCurrency(0, 'USD')).toMatch(/\$0/);
        expect(formatCurrency(-50_000, 'USD', false)).toContain('-$50,000');
    });
});

test.describe('Calculator Unit Tests - calculateCompoundInterest', () => {
    const baseParams: CalculationParams = {
        initialInvestment: 100_000_000,
        monthlyContribution: 10_000_000,
        annualReturnRate: 8.0,
        investmentHorizonYears: 5,
        currentAge: 30,
        annualExpenses: 200_000_000,
        safeWithdrawalRate: 4.0,
        inflationRate: 3.0,
        adjustForInflation: false,
        compoundingFrequency: 'monthly',
    };

    test('generates exact number of yearly entries matching investment horizon', () => {
        const schedule = calculateCompoundInterest(baseParams);
        expect(schedule).toHaveLength(5);
        expect(schedule[0].year).toBe(1);
        expect(schedule[0].age).toBe(31);
        expect(schedule[4].year).toBe(5);
        expect(schedule[4].age).toBe(35);
    });

    test('correctly computes monthly compounding accumulation', () => {
        const schedule = calculateCompoundInterest(baseParams);
        
        // Year 1 start balance should equal initial investment
        expect(schedule[0].startBalance).toBe(100_000_000);
        expect(schedule[0].annualContribution).toBe(120_000_000);
        expect(schedule[0].totalContributed).toBe(220_000_000);
        
        // End balance must exceed total contributions due to interest
        expect(schedule[0].endBalance).toBeGreaterThan(schedule[0].totalContributed);
        expect(schedule[0].interestEarnedYear).toBeGreaterThan(0);
        expect(schedule[0].totalInterestEarned).toBe(schedule[0].interestEarnedYear);

        // Year 2 start balance must equal Year 1 end balance
        expect(schedule[1].startBalance).toBe(schedule[0].endBalance);
    });

    test('correctly handles annual compounding frequency', () => {
        const annualParams: CalculationParams = {
            ...baseParams,
            compoundingFrequency: 'annually',
        };
        const schedule = calculateCompoundInterest(annualParams);
        
        // In annual compounding, yearly contribution is 10M * 12 = 120M
        // End balance = (100M + 120M) * 1.08 = 237.6M
        expect(schedule[0].annualContribution).toBe(120_000_000);
        expect(schedule[0].startBalance).toBe(100_000_000);
        expect(schedule[0].interestEarnedYear).toBeCloseTo(220_000_000 * 0.08, 0);
        expect(schedule[0].endBalance).toBeCloseTo(220_000_000 * 1.08, 0);
    });

    test('correctly computes real (inflation-adjusted) end balance', () => {
        const schedule = calculateCompoundInterest(baseParams);
        
        // Inflation discount factor for year 1 with 3% inflation is 1.03
        const year1 = schedule[0];
        expect(year1.realEndBalance).toBeCloseTo(year1.endBalance / 1.03, 0);
        expect(year1.realEndBalance).toBeLessThan(year1.endBalance);

        // Year 5 inflation factor is (1.03)^5
        const year5 = schedule[4];
        expect(year5.realEndBalance).toBeCloseTo(year5.endBalance / Math.pow(1.03, 5), 0);
    });

    test('handles 0% return rate (pure savings)', () => {
        const zeroReturnParams: CalculationParams = {
            ...baseParams,
            annualReturnRate: 0,
            investmentHorizonYears: 3,
        };
        const schedule = calculateCompoundInterest(zeroReturnParams);
        
        expect(schedule[0].interestEarnedYear).toBe(0);
        expect(schedule[2].totalInterestEarned).toBe(0);
        // Total end balance should be strictly initial + 3 * (10M * 12) = 100M + 360M = 460M
        expect(schedule[2].endBalance).toBe(460_000_000);
        expect(schedule[2].totalContributed).toBe(460_000_000);
    });

    test('handles zero initial investment and zero contributions', () => {
        const zeroParams: CalculationParams = {
            ...baseParams,
            initialInvestment: 0,
            monthlyContribution: 0,
        };
        const schedule = calculateCompoundInterest(zeroParams);
        expect(schedule[4].endBalance).toBe(0);
        expect(schedule[4].totalInterestEarned).toBe(0);
    });
});

test.describe('Calculator Unit Tests - calculateFireMetrics', () => {
    const defaultParams: CalculationParams = {
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

    test('calculates FIRE targets according to SWR (Rule of 25)', () => {
        const schedule = calculateCompoundInterest(defaultParams);
        const metrics = calculateFireMetrics(defaultParams, schedule, 'VND');

        // Target FIRE = 240,000,000 / 0.04 = 6,000,000,000 (25x)
        expect(metrics.fireNumber).toBe(6_000_000_000);
        // Lean FIRE = 75% of FIRE
        expect(metrics.leanFireNumber).toBe(4_500_000_000);
        // Fat FIRE = 135% of FIRE
        expect(metrics.fatFireNumber).toBeCloseTo(8_100_000_000, 0);
    });

    test('calculates Coast FIRE discount value accurately', () => {
        const schedule = calculateCompoundInterest(defaultParams);
        const metrics = calculateFireMetrics(defaultParams, schedule, 'VND');

        // Coast FIRE = 6B / (1 + 0.08)^20
        const expectedCoast = 6_000_000_000 / Math.pow(1.08, 20);
        expect(metrics.coastFireNumber).toBeCloseTo(expectedCoast, -1);
    });

    test('tracks years to FIRE and FIRE age when reached', () => {
        const schedule = calculateCompoundInterest(defaultParams);
        const metrics = calculateFireMetrics(defaultParams, schedule, 'VND');

        expect(metrics.fireAchieved).toBe(true);
        expect(metrics.yearsToFire).toBeGreaterThan(0);
        expect(metrics.yearsToFire).toBeLessThanOrEqual(20);
        expect(metrics.fireAge).toBe(defaultParams.currentAge + (metrics.yearsToFire ?? 0));
    });

    test('handles case where initial investment already exceeds FIRE number', () => {
        const highInitialParams: CalculationParams = {
            ...defaultParams,
            initialInvestment: 10_000_000_000, // 10B > 6B target
        };
        const schedule = calculateCompoundInterest(highInitialParams);
        const metrics = calculateFireMetrics(highInitialParams, schedule, 'VND');

        expect(metrics.fireAchieved).toBe(true);
        expect(metrics.yearsToFire).toBe(0);
        expect(metrics.fireAge).toBe(28);
    });

    test('handles case where FIRE is not achieved within investment horizon', () => {
        const shortHorizonParams: CalculationParams = {
            ...defaultParams,
            initialInvestment: 10_000_000,
            monthlyContribution: 1_000_000,
            investmentHorizonYears: 3,
        };
        const schedule = calculateCompoundInterest(shortHorizonParams);
        const metrics = calculateFireMetrics(shortHorizonParams, schedule, 'VND');

        expect(metrics.fireAchieved).toBe(false);
        expect(metrics.yearsToFire).toBeNull();
        expect(metrics.fireAge).toBeNull();
    });

    test('adjusts FIRE calculations for inflation when enabled', () => {
        const inflationParams: CalculationParams = {
            ...defaultParams,
            adjustForInflation: true,
        };
        const schedule = calculateCompoundInterest(inflationParams);
        const nominalMetrics = calculateFireMetrics(defaultParams, schedule, 'VND');
        const realMetrics = calculateFireMetrics(inflationParams, schedule, 'VND');

        // Real final balance must be lower than nominal final balance
        expect(realMetrics.finalBalance).toBeLessThan(nominalMetrics.finalBalance);
    });

    test('generates correct milestone structures and progress for VND', () => {
        const schedule = calculateCompoundInterest(defaultParams);
        const metrics = calculateFireMetrics(defaultParams, schedule, 'VND');

        expect(metrics.milestones.length).toBe(6);
        const milestoneIds = metrics.milestones.map((m) => m.id);
        expect(milestoneIds).toEqual([
            'first_100m',
            'coast_fire',
            'first_1b',
            'lean_fire',
            'full_fire',
            'fat_fire',
        ]);

        // Since initial is 100M, first_100m milestone should be achieved at year 0
        const first100m = metrics.milestones.find((m) => m.id === 'first_100m');
        expect(first100m?.achieved).toBe(true);
        expect(first100m?.achievedYear).toBe(0);
        expect(first100m?.progressPercentage).toBe(100);
    });

    test('generates correct milestone structures and progress for USD', () => {
        const usdParams: CalculationParams = {
            initialInvestment: 25000,
            monthlyContribution: 1500,
            annualReturnRate: 8.0,
            investmentHorizonYears: 20,
            currentAge: 28,
            annualExpenses: 48000,
            safeWithdrawalRate: 4.0,
            inflationRate: 2.5,
            adjustForInflation: false,
            compoundingFrequency: 'monthly',
        };
        const schedule = calculateCompoundInterest(usdParams);
        const metrics = calculateFireMetrics(usdParams, schedule, 'USD');

        expect(metrics.milestones.length).toBe(6);
        const milestoneIds = metrics.milestones.map((m) => m.id);
        expect(milestoneIds).toEqual([
            'first_100k',
            'coast_fire',
            'first_500k',
            'lean_fire',
            'full_fire',
            'fat_fire',
        ]);
        expect(metrics.fireNumber).toBe(1_200_000); // 48,000 / 0.04
    });
});
