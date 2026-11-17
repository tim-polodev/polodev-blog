import { test, expect } from '@playwright/test';
import {
    formatCurrency,
    calculateCompoundInterest,
    calculateFireMetrics,
    CalculationParams,
    LifeStageSegment,
    getDefaultSegmentsVND,
    getDefaultSegmentsUSD,
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

test.describe('Calculator Unit Tests - Dynamic Income and Expense Growth', () => {
    const dynamicParams: CalculationParams = {
        initialInvestment: 100_000_000,
        monthlyContribution: 15_000_000,
        monthlyIncome: 35_000_000,
        annualIncomeGrowthRate: 5.0, // 5% income raises per year
        annualExpenses: 240_000_000,
        annualExpenseGrowthRate: 3.0, // 3% expense inflation per year
        annualReturnRate: 8.0,
        investmentHorizonYears: 5,
        currentAge: 28,
        safeWithdrawalRate: 4.0,
        inflationRate: 3.5,
        adjustForInflation: false,
        compoundingFrequency: 'monthly',
    };

    test('calculates escalating monthly and annual income with annualIncomeGrowthRate', () => {
        const schedule = calculateCompoundInterest(dynamicParams);
        expect(schedule).toHaveLength(5);

        // Year 1: Base income (35M/mo, 420M/yr)
        expect(schedule[0].monthlyIncome).toBe(35_000_000);
        expect(schedule[0].annualIncome).toBe(420_000_000);

        // Year 2: 35M * 1.05 = 36.75M/mo, 441M/yr
        expect(schedule[1].monthlyIncome).toBeCloseTo(36_750_000, 0);
        expect(schedule[1].annualIncome).toBeCloseTo(441_000_000, 0);

        // Year 5: 35M * (1.05)^4 = 42,542,618.75
        const expectedYear5Monthly = 35_000_000 * Math.pow(1.05, 4);
        expect(schedule[4].monthlyIncome).toBeCloseTo(expectedYear5Monthly, 0);
        expect(schedule[4].annualIncome).toBeCloseTo(expectedYear5Monthly * 12, 0);
    });

    test('escalates monthly and annual contributions proportionally with income growth', () => {
        const schedule = calculateCompoundInterest(dynamicParams);

        // Year 1: 15M * 12 = 180M
        expect(schedule[0].annualContribution).toBe(180_000_000);

        // Year 2: 15M * 1.05 * 12 = 189M
        expect(schedule[1].annualContribution).toBeCloseTo(189_000_000, 0);

        // Total contributed over 5 years must exceed static 5 * 180M (900M)
        expect(schedule[4].totalContributed).toBeGreaterThan(900_000_000);
    });

    test('calculates escalating annual expenses with annualExpenseGrowthRate', () => {
        const schedule = calculateCompoundInterest(dynamicParams);

        // Year 1: 240M/yr, 20M/mo
        expect(schedule[0].annualExpenses).toBe(240_000_000);
        expect(schedule[0].monthlyExpenses).toBe(20_000_000);

        // Year 2: 240M * 1.03 = 247.2M/yr, 20.6M/mo
        expect(schedule[1].annualExpenses).toBeCloseTo(247_200_000, 0);
        expect(schedule[1].monthlyExpenses).toBeCloseTo(20_600_000, 0);

        // Year 5: 240M * (1.03)^4
        const expectedYear5Expenses = 240_000_000 * Math.pow(1.03, 4);
        expect(schedule[4].annualExpenses).toBeCloseTo(expectedYear5Expenses, 0);
    });

    test('calculates dynamic FIRE target for each year matching expense escalation', () => {
        const schedule = calculateCompoundInterest(dynamicParams);

        // Year 1: 240M / 0.04 = 6B
        expect(schedule[0].fireTargetYear).toBe(6_000_000_000);

        // Year 2: 247.2M / 0.04 = 6.18B
        expect(schedule[1].fireTargetYear).toBeCloseTo(6_180_000_000, 0);

        // Year 5: Year 5 Expenses / 0.04
        const expectedYear5Fire = (240_000_000 * Math.pow(1.03, 4)) / 0.04;
        expect(schedule[4].fireTargetYear).toBeCloseTo(expectedYear5Fire, 0);
    });

    test('calculates correct savings rate for each year', () => {
        const schedule = calculateCompoundInterest(dynamicParams);

        // (15M / 35M) * 100 = 42.857...%
        expect(schedule[0].savingsRateYear).toBeCloseTo((15 / 35) * 100, 1);
        expect(schedule[4].savingsRateYear).toBeCloseTo((15 / 35) * 100, 1);
    });

    test('maintains 100% backward compatibility when growth rates are 0 or omitted', () => {
        const staticParams: CalculationParams = {
            initialInvestment: 50_000_000,
            monthlyContribution: 5_000_000,
            annualReturnRate: 7.0,
            investmentHorizonYears: 3,
            currentAge: 25,
            annualExpenses: 120_000_000,
            safeWithdrawalRate: 4.0,
            inflationRate: 3.0,
            adjustForInflation: false,
            compoundingFrequency: 'monthly',
        };

        const schedule = calculateCompoundInterest(staticParams);
        expect(schedule).toHaveLength(3);

        // Every year has the exact same annual contribution
        expect(schedule[0].annualContribution).toBe(60_000_000);
        expect(schedule[1].annualContribution).toBe(60_000_000);
        expect(schedule[2].annualContribution).toBe(60_000_000);

        // Static FIRE target = 120M / 0.04 = 3B
        expect(schedule[0].fireTargetYear).toBe(3_000_000_000);
        expect(schedule[2].fireTargetYear).toBe(3_000_000_000);
    });

    test('handles edge cases (zero income, zero expenses, high growth rate)', () => {
        const edgeParams: CalculationParams = {
            ...dynamicParams,
            monthlyIncome: 0,
            annualExpenses: 0,
            annualIncomeGrowthRate: 15.0,
            annualExpenseGrowthRate: 15.0,
        };

        const schedule = calculateCompoundInterest(edgeParams);
        expect(schedule[0].savingsRateYear).toBe(0);
        expect(schedule[0].fireTargetYear).toBe(0);
        expect(schedule[4].monthlyIncome).toBe(0);
        expect(schedule[4].annualExpenses).toBe(0);
    });
});

test.describe('Calculator Unit Tests - Multi-Stage Life Segments (Decreasing/Increasing Expenses)', () => {
    const lifeStageSegments: LifeStageSegment[] = [
        {
            id: 'stage_1',
            name: 'Early Career',
            fromAge: 22,
            toAge: 30,
            monthlyIncome: 25_000_000,
            monthlyExpenses: 15_000_000,
            monthlyContribution: 10_000_000,
        },
        {
            id: 'stage_2',
            name: 'Family & Kids (Peak Expenses)',
            fromAge: 31,
            toAge: 45,
            monthlyIncome: 65_000_000,
            monthlyExpenses: 40_000_000,
            monthlyContribution: 25_000_000,
        },
        {
            id: 'stage_3',
            name: 'Empty Nest (Expenses Drop)',
            fromAge: 46,
            toAge: 55,
            monthlyIncome: 90_000_000,
            monthlyExpenses: 25_000_000, // Expenses drop from 40M to 25M as kids grow up
            monthlyContribution: 65_000_000,
        },
        {
            id: 'stage_4',
            name: 'Pre-Retirement',
            fromAge: 56,
            toAge: 65,
            monthlyIncome: 40_000_000,
            monthlyExpenses: 20_000_000,
            monthlyContribution: 20_000_000,
        },
    ];

    const multiStageParams: CalculationParams = {
        initialInvestment: 100_000_000,
        monthlyContribution: 10_000_000,
        annualExpenses: 180_000_000,
        annualReturnRate: 8.0,
        investmentHorizonYears: 35,
        currentAge: 22,
        safeWithdrawalRate: 4.0,
        inflationRate: 3.0,
        adjustForInflation: false,
        compoundingFrequency: 'monthly',
        useCustomSegments: true,
        segments: lifeStageSegments,
    };

    test('calculates distinct income, expense, and contribution amounts across multiple age segments', () => {
        const schedule = calculateCompoundInterest(multiStageParams);
        expect(schedule).toHaveLength(35);

        // Year 1 (Age 23, in Stage 1): 25M income, 15M expenses, 10M contrib
        expect(schedule[0].age).toBe(23);
        expect(schedule[0].monthlyIncome).toBe(25_000_000);
        expect(schedule[0].monthlyExpenses).toBe(15_000_000);
        expect(schedule[0].annualExpenses).toBe(180_000_000);
        expect(schedule[0].annualContribution).toBe(120_000_000);
        expect(schedule[0].segmentName).toBe('Early Career');

        // Year 10 (Age 32, in Stage 2): 65M income, 40M expenses, 25M contrib
        expect(schedule[9].age).toBe(32);
        expect(schedule[9].monthlyIncome).toBe(65_000_000);
        expect(schedule[9].monthlyExpenses).toBe(40_000_000);
        expect(schedule[9].annualExpenses).toBe(480_000_000);
        expect(schedule[9].annualContribution).toBe(300_000_000);
        expect(schedule[9].segmentName).toBe('Family & Kids (Peak Expenses)');

        // Year 25 (Age 47, in Stage 3 Empty Nest): 90M income, 25M expenses (expenses decreased!), 65M contrib
        expect(schedule[24].age).toBe(47);
        expect(schedule[24].monthlyIncome).toBe(90_000_000);
        expect(schedule[24].monthlyExpenses).toBe(25_000_000);
        expect(schedule[24].annualExpenses).toBe(300_000_000);
        expect(schedule[24].annualContribution).toBe(780_000_000);
        expect(schedule[24].segmentName).toBe('Empty Nest (Expenses Drop)');
    });

    test('reflects decreased expenses in lower FIRE target milestone during later life stages', () => {
        const schedule = calculateCompoundInterest(multiStageParams);

        // In Stage 2 (Age 32), FIRE Target = 480M / 0.04 = 12 Billion
        expect(schedule[9].fireTargetYear).toBe(12_000_000_000);

        // In Stage 3 (Age 47, Empty Nest), FIRE Target drops to 300M / 0.04 = 7.5 Billion
        expect(schedule[24].fireTargetYear).toBe(7_500_000_000);
        expect(schedule[24].fireTargetYear).toBeLessThan(schedule[9].fireTargetYear);
    });

    test('template generators getDefaultSegmentsVND and getDefaultSegmentsUSD return realistic presets', () => {
        const vndSegments = getDefaultSegmentsVND(25);
        expect(vndSegments.length).toBeGreaterThanOrEqual(3);
        // Stage 3 (empty nest) expenses should be lower than Stage 2 (family kids)
        expect(vndSegments[2].monthlyExpenses).toBeLessThan(vndSegments[1].monthlyExpenses);

        const usdSegments = getDefaultSegmentsUSD(25);
        expect(usdSegments.length).toBeGreaterThanOrEqual(3);
        expect(usdSegments[2].monthlyExpenses).toBeLessThan(usdSegments[1].monthlyExpenses);
    });
});
