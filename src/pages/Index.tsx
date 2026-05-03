import { useState } from "react";
import { Star, Github, GitFork, Eye, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface RepoData {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  html_url: string;
  owner: { avatar_url: string; login: string };
}

const POPULAR = [
  "facebook/react",
  "vercel/next.js",
  "microsoft/vscode",
  "tailwindlabs/tailwindcss",
];

const Index = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<RepoData[]>([]);

  const fetchRepo = async (slug: string) => {
    const clean = slug.trim().replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
    if (!/^[\w.-]+\/[\w.-]+$/.test(clean)) {
      toast.error("Use format: owner/repo");
      return;
    }
    if (repos.some((r) => r.full_name.toLowerCase() === clean.toLowerCase())) {
      toast.info("Already added");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${clean}`);
      if (!res.ok) throw new Error(res.status === 404 ? "Repo not found" : "Failed to load");
      const data = (await res.json()) as RepoData;
      setRepos((prev) => [data, ...prev]);
      setInput("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const formatNum = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <span className="font-semibold">StarTrack</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            github.com
          </a>
        </div>
      </header>

      <main className="container py-12 max-w-4xl">
        <section className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Track GitHub Stars
          </h1>
          <p className="text-muted-foreground text-lg">
            Add any public repository and watch its stars grow.
          </p>
        </section>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchRepo(input);
          }}
          className="flex gap-2 mb-4"
        >
          <Input
            placeholder="owner/repo or GitHub URL"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="h-12"
          />
          <Button type="submit" size="lg" disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
            Add
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm text-muted-foreground self-center mr-1">Try:</span>
          {POPULAR.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => fetchRepo(p)}
              disabled={loading}
              className="text-xs px-3 py-1 rounded-full border border-border hover:bg-accent transition-colors disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {repos.length === 0 && (
            <Card className="p-12 text-center text-muted-foreground border-dashed">
              No repositories yet. Add one above to get started.
            </Card>
          )}
          {repos.map((repo) => (
            <Card key={repo.full_name} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <img
                  src={repo.owner.avatar_url}
                  alt={`${repo.owner.login} avatar`}
                  className="h-12 w-12 rounded-md"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold hover:underline truncate"
                    >
                      {repo.full_name}
                    </a>
                    <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                  </div>
                  {repo.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                      <span className="font-medium">{formatNum(repo.stargazers_count)}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <GitFork className="h-4 w-4" />
                      {formatNum(repo.forks_count)}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      {formatNum(repo.watchers_count)}
                    </span>
                    {repo.language && (
                      <span className="text-muted-foreground">{repo.language}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
