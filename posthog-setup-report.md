<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this project. PostHog is initialized in `src/main.tsx` using `posthog-js`, the browser-side SDK. Eight events are now tracked across the main application page to capture user engagement, discovery behavior, and errors.

| Event | Description | File |
|---|---|---|
| `username_submitted` | User submits a GitHub username to load their starred repositories | `src/pages/Index.tsx` |
| `stars_loaded` | GitHub starred repositories successfully fetched for a user | `src/pages/Index.tsx` |
| `stars_refreshed` | User clicks the Refresh button to force-fetch latest stars | `src/pages/Index.tsx` |
| `repo_filter_applied` | User applies a text search filter to narrow down repositories (debounced, 500ms) | `src/pages/Index.tsx` |
| `language_filter_toggled` | User selects or deselects a programming language filter | `src/pages/Index.tsx` |
| `language_filters_cleared` | User clears all active language filters | `src/pages/Index.tsx` |
| `repo_link_clicked` | User clicks a repository card link to open it on GitHub | `src/pages/Index.tsx` |
| `github_api_error` | GitHub API call fails (e.g., user not found or rate limited) | `src/pages/Index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1582559)
- [Stars Loaded Over Time](/insights/cO29OyI2) — daily unique users who loaded starred repositories
- [Username Search to Stars Loaded Funnel](/insights/nYRTI5g7) — conversion from username submit to successful load
- [Repository Clicks](/insights/biIwDWxS) — daily total clicks on repository links to GitHub
- [GitHub API Errors](/insights/5HMEUccU) — daily count of GitHub API failures
- [User Engagement Actions](/insights/XpfFdOLY) — language filter toggles, text filters, and refreshes over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
