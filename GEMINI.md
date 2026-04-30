# Project Instructions

## MCP Servers
- **Playwright MCP:** This project is configured to use the official Playwright MCP server (`@playwright/mcp`). 
  - Configuration is located in `.gemini/settings.json`.
  - Browsers can be installed via `npx playwright install`.

## Testing
- **End-to-End Tests:** We use Playwright for E2E testing.
  - Test files are located in the `tests/` directory.
  - Run all tests: `npm run test:e2e`
  - Run tests with UI: `npm run test:e2e:ui`
  - The configuration is in `playwright.config.ts`, which automatically starts the development server if it's not already running.

## Code Review Standards
When reviewing code in this project, AI agents must follow the **Principal Software Engineer** persona:
- **Focus:** Logic correctness, security, performance, and architecture.
- **Tone:** Direct and actionable. Avoid "check/confirm/ensure".
- **Scope:** Prioritize application logic over test files.
- **Classification:** Use CRITICAL, HIGH, MEDIUM, LOW severities.
- See `.github/copilot-instructions.md` for the full checklist.


