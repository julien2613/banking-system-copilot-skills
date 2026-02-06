---
name: test-responsive
description: "Test responsive design across mobile, tablet, and desktop viewports using MCP Playwright. Use this skill when the user wants to verify that a web application adapts correctly to different screen sizes, check navigation collapse, or validate layout at various breakpoints."
---

# Responsive Design Testing with MCP Playwright

You are a QA engineer testing the responsive design of a React TypeScript web application using the MCP Playwright server.

## Prerequisites

- The app must be running at `http://localhost:3000` (or ask the user for the URL)
- If the app is not reachable, inform the user and stop

## Setup

```bash
mkdir -p test-reports
```

## Instructions

### Step 1 — Define viewports

| Device | Width | Height |
|--------|-------|--------|
| Mobile | 375 | 667 |
| Tablet | 768 | 1024 |
| Desktop | 1440 | 900 |

### Step 2 — Test each viewport

For each viewport, perform these steps **in this exact order**:

1. **Resize first** — `browser_resize` to set the viewport:
   ```json
   { "name": "browser_resize", "arguments": { "width": 375, "height": 667 } }
   ```

2. **Then navigate** — `browser_navigate` to `http://localhost:3000`

3. **Snapshot** — `browser_snapshot` to capture the accessibility tree. Check:
   - Are all interactive elements still reachable?
   - Does the navigation adapt (hamburger menu vs full nav)?
   - Are form fields still accessible?

4. **Screenshot** — `browser_take_screenshot` with viewport-specific filename:
   ```json
   { "name": "browser_take_screenshot", "arguments": { "type": "png", "filename": "test-reports/responsive-375x667.png", "fullPage": true } }
   ```

5. **Navigate to other pages** (`/register`, `/login`) and repeat snapshot + screenshot

### Step 3 — Check responsive patterns

From the snapshots, verify:

| Pattern | Mobile (375) | Tablet (768) | Desktop (1440) |
|---------|-------------|-------------|----------------|
| Navigation | Should collapse or stack | May collapse | Full horizontal nav |
| Form layout | Single column, full width | Centered card | Centered card |
| Buttons | Full width, min 44px height | Auto width | Auto width |
| Text | Readable, no truncation | Readable | Readable |
| Horizontal scroll | Must NOT exist | Must NOT exist | Must NOT exist |

> **Note**: `browser_snapshot` shows the accessibility tree, not visual layout. Use `browser_take_screenshot` for visual verification. Use the snapshot to verify that all elements remain **accessible** (have names, are reachable) at each viewport.

## Output

Write the report to `test-reports/responsive-report.md`:

| Page | Viewport | Elements Accessible | Navigation | Screenshot | Status |
|------|----------|-------------------|------------|------------|--------|
| /login | 375x667 | Yes/No | Adapted/Same | responsive-375x667.png | Pass/Fail |
| /login | 768x1024 | Yes/No | Adapted/Same | responsive-768x1024.png | Pass/Fail |
| /login | 1440x900 | Yes/No | Full nav | responsive-1440x900.png | Pass/Fail |

Summary:
- Viewports tested: 3
- Pages tested: X
- Issues found: Y
- Recommendations
