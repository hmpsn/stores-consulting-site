import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const coreRoutes = [
  '/', '/about/', '/approach/', '/results/', '/clients/', '/services/',
  '/services/shrink-profit-recovery/', '/services/fresh-inventory-operations/',
  '/services/workforce-store-execution/', '/services/technology-adoption-change-management/',
  '/contact-us/', '/tscg-blog/', '/styleguide/',
];

test.describe('production structure', () => {
  for (const route of coreRoutes) {
    test(`${route} renders without overflow`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('main h1')).toHaveCount(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test('navigation uses real history and survives reload', async ({ page }) => {
    test.skip(test.info().project.name === 'chromium-no-js', 'History behavior is covered in JavaScript-enabled browsers.');
    await page.goto('/');
    const mobile = page.locator('.mobile-nav summary');
    if (await mobile.isVisible()) await mobile.click();
    await page.locator('a[href="/approach/"]:visible').first().click();
    await expect(page).toHaveURL(/\/approach\/$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/approach\/$/);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Two paths in');
  });

  test('mobile disclosure is keyboard accessible', async ({ page, viewport }) => {
    test.skip((viewport?.width || 1440) > 1000, 'Mobile navigation is only displayed at compact widths.');
    await page.goto('/');
    const summary = page.locator('.mobile-nav summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.mobile-nav nav')).toBeVisible();
    await expect(page.locator('.mobile-nav a[href="/services/"]')).toBeVisible();
  });

  test('core pages have no critical or serious axe violations', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Accessibility scan runs once on the desktop project.');
    await page.goto('/');
    const results = await new AxeBuilder({ page }).exclude('.cf-turnstile').exclude('astro-dev-toolbar').disableRules(['color-contrast']).analyze();
    const structural = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious');
    expect(structural).toEqual([]);
  });
});

test.describe('contact endpoint safeguards', () => {
  test('rejects invalid required fields', async ({ request }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Endpoint tests run once.');
    const response = await request.post('/api/contact', { headers: { accept: 'application/json', origin: 'http://127.0.0.1:4321' }, form: { name: '', email: 'bad', message: '' } });
    expect(response.status()).toBe(422);
    await expect(response.json()).resolves.toMatchObject({ ok: false, code: 'invalid' });
  });

  test('silently accepts honeypot submissions', async ({ request }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Endpoint tests run once.');
    const response = await request.post('/api/contact', { headers: { accept: 'application/json', origin: 'http://127.0.0.1:4321' }, form: { name: 'Bot', email: 'bot@example.com', message: 'Spam', website: 'https://spam.example' } });
    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true });
  });

  test('rejects a valid payload without Turnstile', async ({ request }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Endpoint tests run once.');
    const response = await request.post('/api/contact', { headers: { accept: 'application/json', origin: 'http://127.0.0.1:4321' }, form: { name: 'Test User', email: 'test@example.com', message: 'A legitimate test message.' } });
    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ ok: false, code: 'verification' });
  });
});
