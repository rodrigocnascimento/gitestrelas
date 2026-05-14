# Changelog

## v1.0.0 (2026-05-14)

### Features
- GitHub stars viewer with username search and pagination
- Language filter panel with sort by count or alphabetically
- Cache layer with localStorage and TTL for starred repos
- Refresh button to force re-fetch stars
- Dark mode toggle with system theme support
- Multi-page pagination for repository list

### Analytics & Monitoring
- PostHog integration with 8 tracked events (username submit, stars load, filters, errors, etc.)
- Sentry error reporting for production errors

### CI/CD
- GitHub Actions workflow for automated Fly.io deployment
- GitHub Deployment environment tracking

### Chores
- Removed 33 unused shadcn/ui components
- Removed 12 unused npm dependencies
- Cleaned up Lovable references
- Fixed low-contrast text and SEO findings
