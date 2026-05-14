# GitHub Stars Explorer

A beautiful, responsive web application to explore and filter your GitHub starred repositories by language, with caching and pagination.

## Features

- 🔍 Search repositories by name, description, or language
- 🏷️ Filter by programming language with intelligent sorting (by frequency or alphabetically)
- 💾 Smart caching with localStorage (1-hour TTL) to reduce API calls
- 📱 Fully responsive design
- 🌓 Dark/light theme support with system preference detection
- 🔄 Manual refresh option to bypass cache when needed
- ⚡ Built with modern React ecosystem (Vite, React Query, TypeScript)
- 🎨 Beautiful UI using Shadcn UI components
- 🚀 Deployed to Fly.io

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: React Query (for potential future enhancements)
- **Styling**: Tailwind CSS with Shadcn UI components
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Fly.io
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gitestrelas.git
cd gitestrelas

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev

# Open http://localhost:8080 in your browser
```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## How It Works

1. The app fetches your starred repositories from the GitHub API
2. Results are cached in localStorage for 1 hour to minimize API calls
3. You can search through repositories by name, description, or language
4. Filter by programming language with options to sort by frequency or alphabetically
5. Results are paginated (20 items per page) for better performance
6. Click on any repository to view it on GitHub

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GITHUB_TOKEN=your_github_personal_access_token  # Optional, for higher rate limits
```

Note: The app works without a GitHub token but will be subject to stricter rate limits (60 requests/hour unauthenticated vs 5000/hour authenticated).

### Customization

- **Default Username**: Change `DEFAULT_USERNAME` in `src/pages/Index.tsx`
- **Cache TTL**: Modify `CACHE_TTL_MS` in `src/pages/Index.tsx` (default: 1 hour)
- **Results Per Page**: Adjust `PAGE_SIZE` in `src/pages/Index.tsx` (default: 20)
- **GitHub API Pages**: Change the page loop limit in `loadStars` function (default: 4 pages)

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── DarkModeToggle.tsx  # Theme toggle component
│   └── NavLink.tsx         # Navigation link component
├── hooks/                  # Custom React hooks
│   ├── use-mobile.ts       # Mobile detection hook
│   └── use-toast.ts        # Toast notification hook
├── pages/                  # Page components
│   ├── Index.tsx           # Main application
│   └── NotFound.tsx        # 404 page
├── test/                   # Test utilities and fixtures
│   └── example.test.ts     # Example test
├── App.tsx                 # Main application component
├── main.tsx                # Entry point
└── instrument.tsx          # Sentry error monitoring setup
```

## API Rate Limiting

The GitHub API has rate limits:
- **Unauthenticated**: 60 requests per hour
- **Authenticated**: 5,000 requests per hour

To avoid hitting rate limits during development, consider creating a [GitHub Personal Access Token](https://github.com/settings/tokens) and adding it to your `.env` file as `VITE_GITHUB_TOKEN`.

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Deployment

This application is configured for automatic deployment to Fly.io via GitHub Actions. When code is pushed to the `main` branch, it will automatically build and deploy.

To manually trigger a deployment:
1. Go to the Actions tab in your GitHub repository
2. Select the "Deploy to Fly.io" workflow
3. Click "Run workflow"

## License

MIT

## Acknowledgements

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Vite](https://vitejs.dev/) for the fast build tool
- [React Query](https://tanstack.com/query/v4) for powerful state management
- [Lucide](https://lucide.dev/) for the excellent icon set
- [Fly.io](https://fly.io/) for the seamless deployment platform