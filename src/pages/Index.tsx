import { useEffect, useState } from "react";
import { Star, Github, GitFork, ExternalLink, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface RepoData {
  id: number;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  owner: { avatar_url: string; login: string };
}

const USERNAME = "rodrigocnascimento";

const Index = () => {
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const all: RepoData[] = [];
        for (let page = 1; page <= 4; page++) {
          const res = await fetch(
            `https://api.github.com/users/${USERNAME}/starred?per_page=100&page=${page}`
          );
          if (!res.ok) throw new Error(`GitHub API ${res.status}`);
          const data = (await res.json()) as RepoData[];
          all.push(...data);
          if (data.length < 100) break;
        }
        setRepos(all);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load stars");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatNum = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

  const filtered = repos.filter((r) => {
    const q = query.toLowerCase();
    return (
      !q ||
      r.full_name.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.language?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <span className="font-semibold">My GitHub Stars</span>
          </div>
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            @{USERNAME}
          </a>
        </div>
      </header>

      <main className="container py-10 max-w-5xl">
        <section className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Starred repositories
          </h1>
          <p className="text-muted-foreground text-lg">
            {loading
              ? "Loading your stars…"
              : `${repos.length} repositories starred by @${USERNAME}`}
          </p>
        </section>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by name, description, or language"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 pl-10"
            disabled={loading}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Fetching stars…
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((repo) => (
              <Card
                key={repo.id}
                className="p-5 hover:shadow-md hover:border-foreground/20 transition-all"
              >
                <div className="flex items-start gap-3 mb-2">
                  <img
                    src={repo.owner.avatar_url}
                    alt={`${repo.owner.login} avatar`}
                    className="h-9 w-9 rounded-md"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold hover:underline flex items-center gap-1.5 truncate"
                    >
                      <span className="truncate">{repo.full_name}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                    </a>
                  </div>
                </div>
                {repo.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {repo.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                    <span className="font-medium">{formatNum(repo.stargazers_count)}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <GitFork className="h-4 w-4" />
                    {formatNum(repo.forks_count)}
                  </span>
                  {repo.language && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {repo.language}
                    </span>
                  )}
                </div>
              </Card>
            ))}
            {filtered.length === 0 && (
              <Card className="p-12 text-center text-muted-foreground border-dashed md:col-span-2">
                No repositories match your filter.
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
