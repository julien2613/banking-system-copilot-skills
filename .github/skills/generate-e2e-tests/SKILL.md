---
name: generate-e2e-tests
description: "Generate Playwright E2E test files for a React TypeScript app by analyzing the codebase and exploring the running app with MCP Playwright. Use this skill when the user wants to create automated end-to-end test files with Page Object Model pattern and accessibility-first selectors."
---

# Generate E2E Playwright Tests for React TypeScript

You are a senior QA engineer. Analyze a React TypeScript application using the codebase and MCP Playwright, then generate Playwright E2E test files.

## Prerequisites

- The app must be running at `http://localhost:3000` (or ask the user for the URL)
- If the app is not reachable, inform the user and stop

## Instructions

### Step 1 — Analyze the codebase
Use the codebase search to understand the application:
- Identify all routes/pages from the router configuration
- List all components with user interactions (forms, buttons, modals)
- Identify API endpoints and data fetching logic
- Note authentication flows (login, register, JWT)

### Step 2 — Explore the running app with MCP Playwright
1. `browser_navigate` to `http://localhost:3000`
2. `browser_snapshot` — the snapshot returns a YAML accessibility tree. Each element has:
   - A **role** (e.g., `heading`, `textbox`, `button`, `link`)
   - A **name** (e.g., `"Email address"`, `"Sign in"`)
   - A **ref** (e.g., `[ref=e5]`)
3. Map snapshot roles/names to Playwright selectors:
   - `heading "Sign in"` -> `page.getByRole('heading', { name: 'Sign in' })`
   - `textbox "Email address"` -> `page.getByLabel('Email address')`
   - `button "Sign in"` -> `page.getByRole('button', { name: 'Sign in' })`
4. Navigate through all routes using `browser_click` and document each page

### Step 3 — Create the project structure

Create these directories and files:
```bash
mkdir -p e2e/pages e2e/tests
```

```
e2e/
  ├── playwright.config.ts
  ├── pages/
  │   └── auth.page.ts          # Page Object Model for login/register
  └── tests/
      ├── auth.spec.ts           # Authentication flow tests
      ├── navigation.spec.ts     # Route navigation tests
      └── forms.spec.ts          # Form validation tests
```

### Step 4 — Write tests using these conventions

**Selectors** (accessibility-first, derived from `browser_snapshot`):
```typescript
// DO: Use accessibility selectors
page.getByRole('button', { name: 'Sign in' })
page.getByLabel('Email address')
page.getByRole('heading', { name: /sign in/i })
page.getByRole('link', { name: 'Sign up' })

// DON'T: Use CSS selectors
page.locator('.btn-primary')
page.locator('#email-input')
```

**Page Object Model** (`e2e/pages/auth.page.ts`):
```typescript
import { Page, Locator } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email address');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
```

**Test pattern** (`e2e/tests/auth.spec.ts`):
```typescript
import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';

test.describe('Login @smoke', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(authPage.signInButton).toBeVisible();
  });
});
```

**Playwright Config** (`e2e/playwright.config.ts`):
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
});
```

### Step 5 — Install dependencies
Run in terminal:
```bash
npm install -D @playwright/test
npx playwright install chromium
```

## Output

- Create all files in `e2e/` directory
- Summary of tests generated with coverage areas
- Run command: `npx playwright test --config=e2e/playwright.config.ts`

> **Tip**: Run the `publish-reports` skill to publish this report to GitHub Pages.
