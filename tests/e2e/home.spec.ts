import { test, expect } from '@playwright/test';
import { translations } from '../../src/app/data/translations.js';
import { careerSummary } from '../../src/app/data/career.server.js';
import { companiesList } from '../../src/app/data/companies.server.js';
import { projectsData } from '../../src/app/data/projects.server.js';
import { technologiesList } from '../../src/app/data/technologies.server.js';

const defaultLanguage = 'pt';

const t = (lang: keyof typeof translations, key: string) =>
    translations[lang]?.[key] ?? key;

const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const templateToNumberRegex = (template: string) =>
    new RegExp(escapeRegExp(template).replace('\\{days\\}', '\\d+'));

const getCompanyName = (code: string) =>
    companiesList.find((company) => company.code === code)?.name ?? code;

const getTechnologyName = (code: string) =>
    technologiesList.find((technology) => technology.code === code)?.name ?? code;

test.describe('Home Page', () => {
    test.setTimeout(30000);

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should render the presentation section correctly', async ({ page }) => {
        // Apresentation Component
        await expect(page).toHaveTitle(/Rogério Bayer/);
        await expect(page.getByRole('heading', { name: t(defaultLanguage, 'apresentation.greeting'), level: 1 })).toBeVisible();

        // Scope to presentation section to avoid finding "Full-Stack" in Education or History
        // Traverses up to the immediate parent div containing H1 and P
        const presentationContainer = page
            .getByRole('heading', { name: t(defaultLanguage, 'apresentation.greeting'), level: 1 })
            .locator('xpath=..');

        // Now check for "Full-Stack" strictly within this container
        await expect(presentationContainer.getByText(t(defaultLanguage, 'apresentation.subtitle'))).toBeVisible();
    });

    test('should render the summary and education section', async ({ page }) => {
        // Summary Component
        const summaryHeading = page
            .locator('h2')
            .filter({ hasText: t(defaultLanguage, 'summary.title') })
            .first();
        await expect(summaryHeading).toBeVisible();

        const summarySection = summaryHeading.locator('xpath=..');

        await expect(page.getByText(t(defaultLanguage, 'education.undergrad.title'))).toBeVisible();
        await expect(page.getByText(t(defaultLanguage, 'education.undergrad.subtitle'))).toBeVisible();
        await expect(page.getByText(t(defaultLanguage, 'education.postgrad.title'))).toBeVisible();
        await expect(page.getByText(t(defaultLanguage, 'education.postgrad.subtitle'))).toBeVisible();

        const summaryDaysTemplate = t(defaultLanguage, 'summary.daysIn');
        await expect(page.getByText(templateToNumberRegex(summaryDaysTemplate))).toBeVisible();

        const summaryCompanies = [
            getCompanyName('ufpr'),
            getCompanyName('unyleya'),
            getCompanyName(careerSummary.position.companyCode),
        ];

        for (const companyName of summaryCompanies) {
            await expect(summarySection.getByText(companyName, { exact: true })).toBeVisible();
        }
    });

    test('should render skills summary section', async ({ page }) => {
        // SkillsSummary Component
        // These are H3s
        const languagesHeading = page.getByRole('heading', {
            name: t(defaultLanguage, 'skills.languages'),
            level: 3,
        });
        const frameworksHeading = page.getByRole('heading', {
            name: t(defaultLanguage, 'skills.frameworks'),
            level: 3,
        });
        const toolsHeading = page.getByRole('heading', {
            name: t(defaultLanguage, 'skills.tools'),
            level: 3,
        });

        await expect(languagesHeading).toBeVisible();
        await expect(frameworksHeading).toBeVisible();
        await expect(toolsHeading).toBeVisible();

        // Check if icons are loaded
        const languagesSection = languagesHeading.locator('xpath=..');
        const frameworksSection = frameworksHeading.locator('xpath=..');
        const toolsSection = toolsHeading.locator('xpath=..');

        for (const language of careerSummary.skills.languages) {
            await expect(
                languagesSection.getByText(getTechnologyName(language), { exact: true })
            ).toBeVisible();
        }

        for (const framework of careerSummary.skills.frameworks) {
            await expect(
                frameworksSection.getByText(getTechnologyName(framework), { exact: true })
            ).toBeVisible();
        }

        for (const tool of careerSummary.skills.tools) {
            await expect(
                toolsSection.getByText(getTechnologyName(tool), { exact: true })
            ).toBeVisible();
        }
    });

    test('should render history section', async ({ page }) => {
        // History Component
        // Using level 2 to avoid ambiguity with other headings that happen to contain "Experiência"
        const historyHeading = page.getByRole('heading', {
            name: t(defaultLanguage, 'history.title'),
            level: 2,
        });
        await expect(historyHeading).toBeVisible();

        const historySection = historyHeading.locator('xpath=..');

        for (const experience of careerSummary.history) {
            const positionText = t(defaultLanguage, experience.positionKey);
            const descriptionText = t(defaultLanguage, experience.descriptionKey);
            const companyName = getCompanyName(experience.companyCode);
            const endText = experience.endDate ?? t(defaultLanguage, 'history.current');
            const dateText = `${experience.startDate} - ${endText}`;

            const positionHeading = historySection.getByRole('heading', {
                name: new RegExp(`^${escapeRegExp(positionText)}$`),
                level: 3,
            });
            const experienceContainer = positionHeading.locator('xpath=ancestor::li');

            await expect(positionHeading).toBeVisible();
            await expect(experienceContainer.getByText(companyName, { exact: true })).toBeVisible();
            await expect(experienceContainer.getByText(descriptionText)).toBeVisible();
            await expect(experienceContainer.getByText(dateText, { exact: true })).toBeVisible();
        }
    });

    test('should render projects section', async ({ page }) => {
        // Projects Component
        await expect(page.getByRole('heading', { name: t(defaultLanguage, 'projects.title'), level: 2 })).toBeVisible();

        for (const project of projectsData.projects) {
            await expect(page.getByText(t(defaultLanguage, project.nameKey))).toBeVisible();
            await expect(page.getByText(t(defaultLanguage, project.descriptionKey))).toBeVisible();
        }

        const expectedLinks = projectsData.projects.filter(
            (project) => project.link && project.link !== '#'
        ).length;
        const projectLinks = page.getByRole('link', { name: t(defaultLanguage, 'projects.access') });
        await expect(projectLinks).toHaveCount(expectedLinks);
    });

    test('should render footer and social links', async ({ page }) => {
        // Footer Component
        const year = new Date().getFullYear();
        const footerText = t(defaultLanguage, 'footer.copyright').replace('{year}', `${year}`);
        await expect(page.getByText(footerText)).toBeVisible();

        // Check social links and icons
        const socialLinksContainer = page.locator('footer .flex.justify-center.gap-4');
        await expect(socialLinksContainer).toBeVisible();

        const expectedLinks = ['github', 'linkedin', 'behance', 'email'];
        for (const icon of expectedLinks) {
            const link = socialLinksContainer.locator(`a[aria-label]`).filter({ has: page.locator(`img[src="/${icon}.svg"]`) });
            await expect(link).toBeVisible();
        }
    });
});

test.describe('Language Switching', () => {
    test('should switch languages correctly', async ({ page }) => {
        await page.goto('/');

        // Switch to English
        /* Since we're using "button" locator with text, and the button contains both Flag and Name, 
           we match by the visible text "EN" */
        await page.getByRole('button', { name: 'EN' }).click();

        // Verify change
        await expect(
            page.getByRole('heading', { name: t('en', 'apresentation.greeting'), level: 1 })
        ).toBeVisible();

        // Switch to French
        await page.getByRole('button', { name: 'FR' }).click();
        await expect(
            page.getByRole('heading', { name: t('fr', 'apresentation.greeting'), level: 1 })
        ).toBeVisible();
    });
});
