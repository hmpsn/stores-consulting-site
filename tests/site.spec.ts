import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const coreRoutes = [
  '/', '/about/', '/approach/', '/results/', '/clients/', '/services/',
  '/services/shrink-profit-recovery/', '/services/fresh-inventory-operations/',
  '/services/workforce-store-execution/', '/services/technology-adoption-change-management/',
  '/contact-us/', '/tscg-blog/', '/styleguide/',
  '/category/blog/', '/author/admin/', '/project/kroger/', '/case-studies/', '/hello-world/',
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
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).exclude('astro-dev-toolbar').analyze();
    const structural = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious');
    expect(structural).toEqual([]);
  });

  test('1106px homepage retains approved Field Manual geometry', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1106', 'Targeted layout regression runs at the review viewport.');
    await page.goto('/');
    const proofImageLocator = page.locator('.fm-proof-layout__visual img');
    await proofImageLocator.scrollIntoViewIfNeeded();
    await expect.poll(() => proofImageLocator.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);

    const geometry = await page.evaluate(() => {
      const firstCard = document.querySelector<HTMLElement>('.service-card');
      const philosophy = document.querySelector<HTMLElement>('.philosophy');
      const ctaHeading = document.querySelector<HTMLElement>('.cta-band h2');
      const problemLabel = document.querySelector<HTMLElement>('.problem-card__label');
      const problemHeading = document.querySelector<HTMLElement>('.problem-card h3');
      const headerCta = document.querySelector<HTMLElement>('.site-header__cta');
      const header = document.querySelector<HTMLElement>('.site-header');
      const heroCopy = document.querySelector<HTMLElement>('.fm-hero__copy');
      const heroMedia = document.querySelector<HTMLElement>('.fm-hero > .field-image');
      const sectionHeading = document.querySelector<HTMLElement>('.section__heading');
      const proofVisual = document.querySelector<HTMLElement>('.fm-proof-layout__visual');
      const proofImage = proofVisual?.querySelector<HTMLImageElement>('img');
      const evidencePanel = proofVisual?.querySelector<HTMLElement>('.evidence-panel');
      if (!firstCard || !philosophy || !ctaHeading || !problemLabel || !problemHeading || !headerCta || !header || !heroCopy || !heroMedia || !sectionHeading || !proofVisual || !proofImage || !evidencePanel) return null;
      const philosophyRect = philosophy.getBoundingClientRect();
      const labelRect = problemLabel.getBoundingClientRect();
      const headingRect = problemHeading.getBoundingClientRect();
      return {
        cardInset: Number.parseFloat(getComputedStyle(firstCard).paddingLeft),
        philosophyLeft: philosophyRect.left,
        philosophyRight: innerWidth - philosophyRect.right,
        ctaWidth: ctaHeading.getBoundingClientRect().width,
        labelFont: Number.parseFloat(getComputedStyle(problemLabel).fontSize),
        labelGap: headingRect.top - labelRect.bottom,
        headerCtaHeight: headerCta.getBoundingClientRect().height,
        headerHeight: header.getBoundingClientRect().height,
        heroCopyWidth: heroCopy.getBoundingClientRect().width,
        heroMediaWidth: heroMedia.getBoundingClientRect().width,
        sectionHeadingWidth: sectionHeading.getBoundingClientRect().width,
        proofImageWidth: proofImage.naturalWidth,
        evidencePosition: getComputedStyle(evidencePanel).position,
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry!.cardInset).toBeGreaterThanOrEqual(24);
    expect(Math.abs(geometry!.philosophyLeft - geometry!.philosophyRight)).toBeLessThanOrEqual(1);
    expect(geometry!.ctaWidth).toBeGreaterThan(500);
    expect(geometry!.labelFont).toBeLessThanOrEqual(12);
    expect(geometry!.labelGap).toBeLessThanOrEqual(18);
    expect(geometry!.headerCtaHeight).toBeLessThanOrEqual(46);
    expect(geometry!.headerHeight).toBeLessThanOrEqual(84);
    expect(geometry!.heroCopyWidth).toBeGreaterThan(geometry!.heroMediaWidth);
    expect(geometry!.sectionHeadingWidth).toBeGreaterThanOrEqual(700);
    expect(geometry!.proofImageWidth).toBeGreaterThan(0);
    expect(geometry!.evidencePosition).toBe('absolute');
  });

  test('1106px shared templates retain the compact spacing system', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1106', 'Shared spacing regressions run at the review viewport.');

    await page.goto('/about/');
    const people = await page.locator('.person-card').evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().height));
    expect(Math.max(...people)).toBeLessThanOrEqual(340);
    expect(await page.locator('.person-card .prose').first().evaluate((prose) => Number.parseFloat(getComputedStyle(prose).paddingTop))).toBe(0);
    expect(await page.locator('.site-footer').evaluate((footer) => footer.getBoundingClientRect().height)).toBeLessThanOrEqual(170);

    await page.goto('/services/shrink-profit-recovery/');
    const workstreams = await page.locator('.workstream-grid li').evaluateAll((items) => items.map((item) => item.getBoundingClientRect().height));
    expect(Math.max(...workstreams)).toBeLessThanOrEqual(170);
    expect(await page.locator('.cta-band').evaluate((cta) => getComputedStyle(cta).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');

    await page.goto('/project/kroger/');
    expect(await page.locator('.project-logo img').evaluate((image) => image.getBoundingClientRect().height)).toBeLessThanOrEqual(128);
    expect(await page.locator('.project-content img').evaluate((image) => getComputedStyle(image).display)).toBe('none');

    await page.goto('/case-studies/');
    await expect(page.locator('.legacy-case-grid li')).toHaveCount(39);
    const archiveCards = await page.locator('.legacy-case-grid li').evaluateAll((items) => items.map((item) => item.getBoundingClientRect().height));
    expect(Math.max(...archiveCards)).toBeLessThanOrEqual(320);
  });

  test('1106px typography preserves distinct editorial tiers', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1106', 'Typography regression runs at the review viewport.');

    await page.goto('/');
    const scale = await page.evaluate(() => {
      const size = (selector: string) => Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>(selector)!).fontSize);
      return {
        body: Number.parseFloat(getComputedStyle(document.body).fontSize),
        lead: size('.section__heading > p:not(.eyebrow)'),
        card: size('.problem-card h3'),
        section: size('.section__heading h2'),
      };
    });
    expect(scale.lead - scale.body).toBeGreaterThanOrEqual(3);
    expect(scale.card - scale.lead).toBeGreaterThanOrEqual(4);
    expect(scale.section - scale.card).toBeGreaterThanOrEqual(12);

    await page.goto('/big-data-big-deal/');
    const articleScale = await page.evaluate(() => ({
      body: Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>('.prose p')!).fontSize),
      subheading: Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>('.prose h3')!).fontSize),
    }));
    expect(articleScale.subheading / articleScale.body).toBeGreaterThanOrEqual(1.45);
  });

  test('reduced motion leaves content complete and visible', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Reduced-motion verification runs once.');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
    await expect(page.locator('[data-reveal]').first()).toBeVisible();
  });

  test('production 404 preserves the global structure without overflow', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', '404 verification runs once.');
    const response = await page.goto('/route-that-does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.locator('main h1')).toContainText("That aisle isn't here");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe('contact endpoint safeguards', () => {
  test('rejects cross-origin submissions', async ({ request }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Endpoint tests run once.');
    const response = await request.post('/api/contact', { headers: { accept: 'application/json', origin: 'https://malicious.example' }, form: { name: 'Test User', email: 'test@example.com', message: 'A cross-origin test message.' } });
    expect(response.status()).toBe(403);
  });

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

  test('requires delivery configuration for a valid submission', async ({ request }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Endpoint tests run once.');
    const response = await request.post('/api/contact', { headers: { accept: 'application/json', origin: 'http://127.0.0.1:4321' }, form: { name: 'Test User', email: 'test@example.com', message: 'A legitimate test message.' } });
    expect(response.status()).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ ok: false, code: 'unavailable' });
  });
});
