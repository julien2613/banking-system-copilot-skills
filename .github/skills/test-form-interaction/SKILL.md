---
name: test-form-interaction
description: "Test form interactions (login, register, validation) in a React TypeScript app using MCP Playwright. Use this skill when the user wants to verify form submissions, input validation, error messages, or authentication flows on a running web application."
---

# Form Interaction Testing with MCP Playwright

You are a QA engineer testing form interactions in a React TypeScript web application using the MCP Playwright server.

## Prerequisites

- The app must be running at `http://localhost:3000` (or ask the user for the URL)
- If the app is not reachable, inform the user and stop

## Setup

```bash
mkdir -p test-reports
```

## How to interact with forms via MCP Playwright

1. `browser_snapshot` -> returns accessibility tree with `ref` values for each element
2. `browser_type` -> types text into an input identified by its `ref`
3. `browser_click` -> clicks a button/link identified by its `ref`
4. **After each action**, take a new `browser_snapshot` to see the updated state (new errors, changed values, redirects)

## Instructions

### Step 1 — Discover all forms
1. `browser_navigate` to `http://localhost:3000`
2. `browser_snapshot` — identify all pages from links
3. Navigate to each page and identify forms (look for `textbox`, `button` roles)

### Step 2 — Test the Login form (`/login`)

**Test 2a — Empty submission:**
1. `browser_snapshot` to get the Submit button `ref`
2. `browser_click` on the Sign in button
3. `browser_snapshot` to check for validation error messages

**Test 2b — Invalid email:**
1. `browser_type` on the email field: `"not-an-email"`
2. `browser_type` on the password field: `"password123"`
3. `browser_click` on Sign in
4. `browser_snapshot` to verify "Invalid email" error appears

**Test 2c — Valid login:**
1. Navigate back to `/login` to reset the form
2. `browser_type` on email: `"test@bank.com"`
3. `browser_type` on password: `"password123"`
4. `browser_click` on Sign in
5. `browser_snapshot` to verify redirect to Dashboard

### Step 3 — Test the Register form (`/register`)

**Test 3a — Empty submission:**
1. `browser_navigate` to `/register`
2. `browser_click` on Create account button
3. `browser_snapshot` to verify validation errors

**Test 3b — Password mismatch:**
1. `browser_navigate` to `/register` (reset form)
2. `browser_type` on Full name: `"Test User"`
3. `browser_type` on Email: `"newuser@test.com"`
4. `browser_type` on Password: `"password123"`
5. `browser_type` on Confirm password: `"differentpass"`
6. `browser_click` on Create account
7. `browser_snapshot` to verify "Passwords must match" error

**Test 3c — Valid registration:**
1. `browser_navigate` to `/register` (reset form)
2. `browser_type` on Full name: `"New User"`
3. `browser_type` on Email: `"newuser@test.com"`
4. `browser_type` on Password: `"SecurePass123"`
5. `browser_type` on Confirm password: `"SecurePass123"`
6. Accept terms if checkbox exists
7. `browser_click` on Create account
8. `browser_snapshot` to verify success (redirect to dashboard or success message)

## Output

Write the report to `test-reports/form-interaction-report.md`:

| # | Form | Test Case | Input | Expected | Actual | Status |
|---|------|-----------|-------|----------|--------|--------|
| 2a | Login | Empty submit | none | Validation errors | ... | Pass/Fail |
| 2b | Login | Invalid email | not-an-email | Email error | ... | Pass/Fail |
| 2c | Login | Valid login | test@bank.com | Dashboard redirect | ... | Pass/Fail |
| 3a | Register | Empty submit | none | Validation errors | ... | Pass/Fail |
| 3b | Register | Password mismatch | differentpass | Mismatch error | ... | Pass/Fail |
| 3c | Register | Valid register | valid data | Success | ... | Pass/Fail |

Summary:
- Forms tested: 2
- Test cases: X passed / Y failed
- Critical issues found
