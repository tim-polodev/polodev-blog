import { test, expect } from '@playwright/test';

test.describe('FIRE & Compound Interest Calculator (/tools/fire-calculator)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/tools/fire-calculator');
        // Wait for React hydration (dark mode toggle is only mounted after client hydration)
        await expect(page.getByRole('button', { name: 'Toggle dark mode' })).toBeVisible();
    });

    test('renders the page and has correct document title and header', async ({ page }) => {
        await expect(page).toHaveTitle(/FIRE & Compound Interest Calculator \| Polodev/i);
        const heading = page.getByRole('heading', { level: 1 });
        await expect(heading).toBeVisible();
    });

    test('defaults to VND currency with correct symbol and options', async ({ page }) => {
        const currencySelect = page.locator('#currency-select');
        await expect(currencySelect).toBeVisible();
        await expect(currencySelect).toHaveValue('VND');

        // Check options: only VND and USD
        const options = currencySelect.locator('option');
        await expect(options).toHaveCount(2);
        await expect(options.nth(0)).toHaveText('VND (₫)');
        await expect(options.nth(1)).toHaveText('USD ($)');

        // Verify VND currency symbol appears in input prefix
        const initialInvestmentContainer = page.locator('#initial-investment').locator('..');
        await expect(initialInvestmentContainer.getByText('₫')).toBeVisible();
    });

    test('displays key metric summary cards', async ({ page }) => {
        await expect(page.getByText('Compound Growth', { exact: true })).toBeVisible();
        await expect(page.getByText('FIRE Target (SWR)', { exact: true })).toBeVisible();
        await expect(page.getByText('Time to FIRE', { exact: true })).toBeVisible();
    });

    test('updates calculations when user changes inputs', async ({ page }) => {
        const initialInvestmentInput = page.locator('#initial-investment');
        await expect(initialInvestmentInput).toBeVisible();

        // Target the first metric card (Projected Portfolio Value)
        const metricCard = page.locator('.grid > div').first();
        const initialCardText = await metricCard.innerText();

        // Change initial investment in VND from 100M to 500M
        await initialInvestmentInput.fill('500000000');

        // Check that the metric card updated
        await expect(metricCard).not.toHaveText(initialCardText);
    });

    test('switching currency to USD updates presets, symbols, and values', async ({ page }) => {
        const currencySelect = page.locator('#currency-select');
        await currencySelect.selectOption('USD');
        await expect(currencySelect).toHaveValue('USD');

        // Verify USD currency symbol appears in input prefix
        const initialInvestmentContainer = page.locator('#initial-investment').locator('..');
        await expect(initialInvestmentContainer.getByText('$')).toBeVisible();

        // Verify USD presets appear
        const aggressivePreset = page.getByRole('button', { name: /Aggressive Saver/i });
        await expect(aggressivePreset).toBeVisible();
        await aggressivePreset.click();

        const monthlyInput = page.locator('#monthly-contribution');
        await expect(monthlyInput).toHaveValue('3500');

        // Switch back to VND
        await currencySelect.selectOption('VND');
        await expect(currencySelect).toHaveValue('VND');
        await expect(initialInvestmentContainer.getByText('₫')).toBeVisible();
        await expect(page.getByRole('button', { name: /Standard FIRE/i })).toBeVisible();
    });

    test('displays preset description when hovering over quick scenario presets', async ({ page }) => {
        // Standard FIRE preset in VND
        const standardPresetButton = page.getByRole('button', { name: /Standard FIRE/i });
        await expect(standardPresetButton).toBeVisible();
        await expect(standardPresetButton).toHaveText(/Standard FIRE/);
        await expect(standardPresetButton).toHaveAttribute('title', 'Steady 3.5% salary growth & 2.5% expense inflation');

        // Hover over Standard FIRE button
        await standardPresetButton.hover();
        const standardTooltip = page.locator('[role="tooltip"]').filter({ hasText: 'Steady 3.5% salary growth & 2.5% expense inflation' });
        await expect(standardTooltip).toBeVisible();

        // Hover over Coast FIRE button
        const coastPresetButton = page.getByRole('button', { name: /Coast FIRE/i });
        await expect(coastPresetButton).toHaveText(/Coast FIRE/);
        await expect(coastPresetButton).toHaveAttribute('title', 'Front-load capital early & let compound interest grow');
        await coastPresetButton.hover();
        const coastTooltip = page.locator('[role="tooltip"]').filter({ hasText: 'Front-load capital early & let compound interest grow' });
        await expect(coastTooltip).toBeVisible();
    });

    test('advanced settings toggle displays monthly income, growth rates, and dynamic savings rate', async ({ page }) => {
        const advancedToggle = page.getByRole('button', { name: /Show Advanced Settings/i });
        await expect(advancedToggle).toBeVisible();
        await advancedToggle.click();

        // Switch to Income & Growth tab
        const incomeTab = page.getByRole('button', { name: /Income & Growth/i });
        await expect(incomeTab).toBeVisible();
        await incomeTab.click();

        const monthlyIncomeInput = page.locator('#monthly-income');
        const incomeGrowthInput = page.locator('#income-growth-rate');
        await expect(monthlyIncomeInput).toBeVisible();
        await expect(incomeGrowthInput).toBeVisible();

        // Switch to Expense Inflation tab and verify
        const expenseTab = page.getByRole('button', { name: /Expense Inflation/i });
        await expect(expenseTab).toBeVisible();
        await expenseTab.click();
        const expenseGrowthInput = page.locator('#expense-growth-rate');
        await expect(expenseGrowthInput).toBeVisible();

        // Switch back to Income & Growth tab
        await incomeTab.click();

        // Fill Monthly Income with 50,000,000 and Monthly Contribution with 25,000,000
        await monthlyIncomeInput.fill('50000000');
        const monthlyContribInput = page.locator('#monthly-contribution');
        await monthlyContribInput.fill('25000000');

        // Verify Savings Rate badge shows 50.0%
        await expect(page.getByText('Savings Rate: 50.0%')).toBeVisible();
        await expect(page.getByText('Net Monthly Flow:')).toBeVisible();
    });

    test('enables multi-stage life segments and custom age brackets with decreasing expenses', async ({ page }) => {
        const advancedToggle = page.getByRole('button', { name: /Show Advanced Settings/i });
        await advancedToggle.click();

        // Enable custom segments toggle
        await page.locator('label[for="use-custom-segments-toggle"]').click();
        await expect(page.getByRole('button', { name: /Family & Empty Nest/i })).toBeVisible();

        // Click Family & Empty Nest template
        await page.getByRole('button', { name: /Family & Empty Nest/i }).click();

        // Verify contextual indicator for decreasing expenses in empty nest
        await expect(page.getByText(/Expenses decrease by/i).first()).toBeVisible();

        // Add a new custom stage segment
        const addStageBtn = page.getByRole('button', { name: /Add Custom Life Stage Segment/i });
        await addStageBtn.click();

        // Switch to Amortization Schedule tab and verify segment names appear in table
        const scheduleTab = page.getByRole('button', { name: /Amortization Schedule/i });
        await scheduleTab.click();
        await expect(page.getByText(/Early Career & Single/i).first()).toBeVisible();
    });

    test('tab navigation switches between Chart, Amortization Schedule, Milestones, and Guide', async ({ page }) => {
        // SVG Growth Chart should be visible initially
        const chart = page.locator('svg[role="img"]');
        await expect(chart).toBeVisible();

        // Switch to Schedule Tab
        const scheduleTab = page.getByRole('button', { name: /Amortization Schedule/i });
        await scheduleTab.click();
        await expect(page.getByRole('heading', { name: /Amortization Schedule/i })).toBeVisible();
        await expect(page.locator('table')).toBeVisible();

        // Check new columns in table
        await expect(page.getByRole('columnheader', { name: /Income \(Mo\)/i })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: /Expenses \(Mo\)/i })).toBeVisible();

        // Switch to Milestones Tab
        const milestonesTab = page.getByRole('button', { name: /Milestones/i });
        await milestonesTab.click();
        await expect(page.getByRole('heading', { name: /Milestones/i })).toBeVisible();
        await expect(page.getByText(/First 100 Million|First \$100k/i)).toBeVisible();

        // Switch to Guide Tab
        const guideTab = page.getByRole('button', { name: /FIRE Guide/i });
        await guideTab.click();
        await expect(page.getByText(/The 4% Rule/i)).toBeVisible();
    });

    test('dark mode toggle functions on the calculator page', async ({ page }) => {
        const themeToggle = page.getByRole('button', { name: 'Toggle dark mode' });
        const html = page.locator('html');

        await expect(html).not.toHaveClass(/dark/);
        await themeToggle.click();
        await expect(html).toHaveClass(/dark/);
        await themeToggle.click();
        await expect(html).not.toHaveClass(/dark/);
    });

    test('calculator is isolated and not linked from the main landing page', async ({ page }) => {
        await page.goto('/');

        // Confirm there are no navigation or body links leading to /tools/fire-calculator
        const calcLink = page.locator('a[href*="/tools/fire-calculator"]');
        const count = await calcLink.count();
        expect(count).toBe(0);
    });
});
