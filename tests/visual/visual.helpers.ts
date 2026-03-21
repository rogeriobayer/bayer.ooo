import { expect, type Locator, type Page } from '@playwright/test';

export type Locale = 'pt' | 'en' | 'fr';

export type ProjectModalCase = {
  slug: string;
  expectedTitle: RegExp;
  expectedImagePath: string;
  screenshotName: string;
};

export const projectModalCases: ProjectModalCase[] = [
  {
    slug: 'powerbi',
    expectedTitle: /Dashboard Analítico de Obras|Construction Analytics Dashboard|Tableau de Bord Analytique/i,
    expectedImagePath: '/powerbi-project.png',
    screenshotName: 'project-modal-powerbi.png',
  },
  {
    slug: 'focuspatrol',
    expectedTitle: /Focus Patrol/i,
    expectedImagePath: '/focus-patrol-project.png',
    screenshotName: 'project-modal-focus-patrol.png',
  },
];

const localeSwitchLabels: Record<Locale, RegExp> = {
  pt: /PT/i,
  en: /EN/i,
  fr: /FR/i,
};

const summaryHeadingByLocale: Record<Locale, RegExp> = {
  pt: /Sobre mim/i,
  en: /About me/i,
  fr: /Sur moi/i,
};

const historyHeadingByLocale: Record<Locale, RegExp> = {
  pt: /Experiência/i,
  en: /Experience/i,
  fr: /Expérience/i,
};

const projectsHeadingByLocale: Record<Locale, RegExp> = {
  pt: /Principais Projetos/i,
  en: /Main Projects/i,
  fr: /Projets Principaux/i,
};

export async function installDeterministicInView(page: Page) {
  await page.addInitScript(() => {
    class AlwaysIntersectingObserver {
      private callback: IntersectionObserverCallback;

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
      }

      observe(target: Element) {
        queueMicrotask(() => {
          this.callback(
            [
              {
                isIntersecting: true,
                target,
                intersectionRatio: 1,
                time: performance.now(),
                boundingClientRect: target.getBoundingClientRect(),
                intersectionRect: target.getBoundingClientRect(),
                rootBounds: null,
              } as IntersectionObserverEntry,
            ],
            this as unknown as IntersectionObserver
          );
        });
      }

      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }

    // Keep framer-motion whileInView deterministic for screenshots.
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: AlwaysIntersectingObserver,
    });
  });
}

export async function openHomeAndStabilize(page: Page) {
  await installDeterministicInView(page);
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `,
  });
  await page.waitForTimeout(300);
}

export async function switchLocale(page: Page, locale: Locale) {
  await page.getByRole('button', { name: localeSwitchLabels[locale] }).click();
  await expect(page.getByRole('heading', { level: 2 }).filter({ hasText: summaryHeadingByLocale[locale] })).toBeVisible();
}

export async function warmUpPageForFullScreenshot(page: Page, locale: Locale) {
  const summaryHeading = page.getByRole('heading', {
    level: 2,
    name: summaryHeadingByLocale[locale],
  });
  await summaryHeading.scrollIntoViewIfNeeded();
  await expect(summaryHeading).toBeVisible();

  const historyHeading = page.getByRole('heading', {
    level: 2,
    name: historyHeadingByLocale[locale],
  });
  await historyHeading.scrollIntoViewIfNeeded();
  await expect(historyHeading).toBeVisible();

  const projectsHeading = page.getByRole('heading', {
    level: 2,
    name: projectsHeadingByLocale[locale],
  });
  await projectsHeading.scrollIntoViewIfNeeded();
  await expect(projectsHeading).toBeVisible();

  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(page.locator('footer')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
}

function extractImagePath(rawSrc: string | null): string {
  if (!rawSrc) return '';
  if (!rawSrc.includes('/_next/image')) return rawSrc;

  const url = new URL(rawSrc, 'http://localhost');
  const optimizedPath = url.searchParams.get('url');
  return optimizedPath ? decodeURIComponent(optimizedPath) : rawSrc;
}

async function assertImageLoaded(locator: Locator) {
  await expect
    .poll(async () => {
      return locator.evaluate((img) => {
        const image = img as HTMLImageElement;
        return image.complete && image.naturalWidth > 0;
      });
    })
    .toBe(true);
}

export async function openProjectModal(page: Page, modalCase: ProjectModalCase): Promise<Locator> {
  const detailsButton = page.getByTestId(`project-details-${modalCase.slug}`);
  await detailsButton.scrollIntoViewIfNeeded();
  await expect(detailsButton).toBeVisible();
  await detailsButton.click();

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await expect(modal.getByRole('heading', { level: 2 })).toContainText(modalCase.expectedTitle);

  const image = modal.locator('img[alt*="screenshot"]').first();
  await expect(image).toBeVisible();
  await assertImageLoaded(image);

  await expect
    .poll(async () => extractImagePath(await image.getAttribute('src')))
    .toBe(modalCase.expectedImagePath);

  const modalContent = modal.locator('.card').first();
  await expect(modalContent).toBeVisible();
  return modalContent;
}
