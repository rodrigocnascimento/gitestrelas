import { useEffect, useMemo, useState, useCallback } from "react";
import { Star, Github, GitFork, ExternalLink, Loader2, Search, User, ChevronDown, Code2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Moon, Sun } from "lucide-react";

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

const DEFAULT_USERNAME = "rodrigocnascimento";
const STORAGE_KEY = "github-stars-username";

const Index = () => {
  const [username, setUsername] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) || DEFAULT_USERNAME
  );
  const [usernameInput, setUsernameInput] = useState(username);
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const loadStars = useCallback(async (user: string) => {
    setLoading(true);
    setRepos([]);
      try {
        const all: RepoData[] = [];
        for (let page = 1; page <= 4; page++) {
          const res = await fetch(
            `https://api.github.com/users/${user}/starred?per_page=100&page=${page}`
          );
          if (!res.ok) {
            throw new Error(
              res.status === 404 ? `User "${user}" not found` : `GitHub API ${res.status}`
            );
          }
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
  }, []);

  useEffect(() => {
    loadStars(username);
  }, [username, loadStars]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = usernameInput.trim().replace(/^@/, "");
    if (!clean) return;
    if (!/^[a-zA-Z0-9-]{1,39}$/.test(clean)) {
      toast.error("Invalid GitHub username");
      return;
    }
    localStorage.setItem(STORAGE_KEY, clean);
    setUsername(clean);
  };

  const formatNum = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set());
  const [languageOpen, setLanguageOpen] = useState(false);

  const languageCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of repos) {
      const lang = r.language || "Unknown";
      map.set(lang, (map.get(lang) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [repos]);

  // Reset language selection when repos change (e.g., switching users)
  useEffect(() => {
    setSelectedLanguages(new Set());
  }, [repos]);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) => {
      const next = new Set(prev);
      if (next.has(lang)) next.delete(lang);
      else next.add(lang);
      return next;
    });
  };

  const filtered = repos.filter((r) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      r.full_name.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.language?.toLowerCase().includes(q);
    const matchesLang =
      selectedLanguages.size === 0 ||
      selectedLanguages.has(r.language || "Unknown");
    return matchesQuery && matchesLang;
  });

  return (
    <>
      <header className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <span className="font-semibold">GitHub Stars</span>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              @{username}
            </a>
          </div>
        </div>
      </header>

      <main className="container py-10 max-w-5xl">
        <section className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Starred repositories
          </h1>
          <p className="text-muted-foreground text-lg">
            {loading
              ? `Loading stars for @${username}…`
              : `${repos.length} repositories starred by @${username}`}
          </p>
        </section>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="GitHub username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="h-12 pl-10"
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={loading || !usernameInput.trim() || usernameInput.trim() === username}
          >
            Load
          </Button>
        </form>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by name, description, or language"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 pl-10"
            disabled={loading}
          />
        </div>

        {languageCounts.length > 0 && (
          <Collapsible open={languageOpen} onOpenChange={setLanguageOpen} className="mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Code2 className="h-4 w-4" />
                  Languages
                  {selectedLanguages.size > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                      {selectedLanguages.size}
                    </span>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${languageOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              {selectedLanguages.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLanguages(new Set())}
                  className="gap-1 text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                  Clear
                </Button>
              )}
              <span className="text-sm text-muted-foreground ml-auto">
                {filtered.length} of {repos.length}
              </span>
            </div>
            <CollapsibleContent className="mt-3">
              <Card className="p-4">
                <div className="flex flex-wrap gap-2">
                  {languageCounts.map(([lang, count]) => {
                    const active = selectedLanguages.has(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:bg-accent"
                        }`}
                      >
                        {lang}
                        <span className={`ml-1.5 ${active ? "opacity-80" : "text-muted-foreground"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}


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
            {filtered.length === 0 && repos.length > 0 && (
              <Card className="p-12 text-center text-muted-foreground border-dashed md:col-span-2">
                No repositories match your filter.
              </Card>
            )}
            {repos.length === 0 && (
              <Card className="p-12 text-center text-muted-foreground border-dashed md:col-span-2">
                No starred repositories found.
              </Card>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default Index;
