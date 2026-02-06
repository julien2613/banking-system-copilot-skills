---
name: test-accessibility
description: "Run a WCAG 2.1 accessibility audit on a React TypeScript app using MCP Playwright snapshots. Use this skill when the user wants to check accessibility compliance, heading hierarchy, landmark roles, form labels, or ARIA attributes on a running web application."
---

# Accessibility Audit with MCP Playwright

You are an accessibility expert auditing a React TypeScript web application using the MCP Playwright server.

## Prerequisites

- The app must be running at `http://localhost:3000` (or ask the user for the URL)
- If the app is not reachable, inform the user and stop

## Setup

```bash
mkdir -p test-reports
```

## How to audit with browser_snapshot

The `browser_snapshot` tool returns a YAML accessibility tree. Use it to check:
- **Headings**: Look for `heading` roles and their levels (h1, h2, etc.)
- **Landmarks**: Look for `banner`, `main`, `contentinfo`, `navigation` roles
- **Form labels**: Check that every `textbox`, `checkbox`, `combobox` has a name
- **Links & buttons**: Verify every `link` and `button` has a non-empty name
- **ARIA**: Check for `aria-label`, `aria-required`, `aria-hidden` attributes

## Instructions

### Step 1 — Navigate and snapshot each page
For each page (`/login`, `/register`, and any other discoverable route):
1. `browser_navigate` to the page
2. `browser_snapshot` to capture the accessibility tree
3. Analyze the tree against the criteria below

### Step 2 — Check WCAG 2.1 criteria

**Level A (minimum):**
| Criterion | What to check in snapshot |
|-----------|-----------------------------|
| 1.1.1 Non-text Content | Images must have alt text (look for `img` role with name) |
| 1.3.1 Info & Relationships | Inputs must have associated labels (textbox must have name) |
| 2.4.1 Bypass Blocks | Skip navigation link should exist |
| 4.1.2 Name, Role, Value | All interactive elements must have accessible names |

**Level AA (recommended):**
| Criterion | What to check in snapshot |
|-----------|-----------------------------|
| 1.4.3 Contrast | Flag elements that may have low contrast (note: snapshot can't verify, flag for manual check) |
| 2.4.6 Headings & Labels | Headings must describe content, labels must describe purpose |
| 2.4.7 Focus Visible | Flag any custom focus styles for manual check |

**Heading hierarchy check:**
- Exactly one `h1` per page
- No skipped levels (h1 -> h3 without h2 = violation)
- Headings must be nested logically

**Landmark roles check:**
- `main` landmark must exist
- `navigation` landmark recommended
- `banner` and `contentinfo` recommended

### Step 3 — Navigate to sub-pages
From the snapshot, identify all `link` elements. Click each one using its `ref` value and repeat the audit.

## Output

Write the report to `test-reports/accessibility-report.md`:

### Page: [URL]
| Criterion | WCAG Level | Status | Details |
|-----------|------------|--------|---------|
| Non-text content (1.1.1) | A | Pass/Fail | ... |
| Form labels (1.3.1) | A | Pass/Fail | ... |
| Heading hierarchy (2.4.6) | AA | Pass/Fail | ... |
| Landmark roles | AA | Pass/Fail | ... |
| ARIA usage (4.1.2) | A | Pass/Fail | ... |

### Summary
- Pages audited: X
- Critical (Level A failures): X
- Major (Level AA failures): X
- Minor (recommendations): X
- Estimated WCAG conformance: A / AA / not conformant
- Recommended code fixes with examples
