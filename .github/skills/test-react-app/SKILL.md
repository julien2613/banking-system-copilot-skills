---
name: test-react-app
description: "Test a React TypeScript app by navigating pages and taking accessibility snapshots using MCP Playwright. Use this skill when the user wants to explore and verify the UI of a running web application, check page elements, or generate a navigation test report."
---

# Test React TypeScript Application with MCP Playwright

You are a QA engineer testing a React TypeScript web application using the MCP Playwright server.

## Prerequisites

- The app must be running at `http://localhost:3000` (or ask the user for the URL)
- Verify connectivity before starting: navigate to the URL and confirm a response
- If the app is not running, inform the user and stop

## Setup

Create the output directory if it doesn't exist:
```bash
mkdir -p test-reports
```

## Instructions

### Step 1 — Navigate to the app
Use `browser_navigate` to open the app:
```json
{ "name": "browser_navigate", "arguments": { "url": "http://localhost:3000" } }
```

### Step 2 — Take an accessibility snapshot
Use `browser_snapshot` to capture the page's accessibility tree. The snapshot returns a YAML structure where each element has a `ref` attribute (e.g., `[ref=e5]`) that you will use in subsequent `browser_click` calls.
```json
{ "name": "browser_snapshot", "arguments": {} }
```

### Step 3 — Verify key elements
From the snapshot, verify:
- The page has a meaningful `<title>`
- At least one heading is visible
- All interactive elements (buttons, links, inputs) have accessible names
- No empty or unnamed interactive elements exist

### Step 4 — Take a screenshot
```json
{ "name": "browser_take_screenshot", "arguments": { "type": "png", "filename": "test-reports/homepage.png", "fullPage": true } }
```

### Step 5 — Discover and test all routes
From the snapshot, identify all links. For each link:
1. Note its `ref` value from the snapshot (e.g., `ref=e12`)
2. Use `browser_click` with that ref:
   ```json
   { "name": "browser_click", "arguments": { "element": "Sign up", "ref": "e12" } }
   ```
3. Take a `browser_snapshot` on the new page
4. Take a `browser_take_screenshot` with a descriptive filename
5. Verify the page loaded correctly (heading visible, no error messages)
6. Navigate back or to the next route

## Output

Write the test report to `test-reports/react-app-report.md` with:

| Page | URL | Title | Heading | Interactive Elements | Screenshot | Status |
|------|-----|-------|---------|---------------------|------------|--------|
| Login | /login | ... | ... | X elements | homepage.png | Pass/Fail |

Summary:
- Total pages tested
- Total elements verified
- Issues or warnings found
- Overall Pass/Fail

> **Tip**: Run the `publish-reports` skill to publish this report to GitHub Pages.
