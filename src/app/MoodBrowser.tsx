"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Mood } from "@/lib/moods";

export default function MoodBrowser({
  moods,
  tags,
}: {
  moods: Mood[];
  tags: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const activeTag = searchParams.get("tag");

  // Build a new query string from the current params, applying updates.
  // A null/empty value deletes the key so the URL stays clean.
  const buildHref = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return moods.filter((mood) => {
      if (activeTag && !mood.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        mood.name.toLowerCase().includes(q) ||
        mood.tagline.toLowerCase().includes(q) ||
        mood.tags.some((t) => t.toLowerCase().includes(q)) ||
        mood.tracks.some(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.artist.toLowerCase().includes(q),
        )
      );
    });
  }, [moods, query, activeTag]);

  function setQuery(value: string) {
    // replace (not push) so each keystroke doesn't create a history entry.
    router.replace(buildHref({ q: value }), { scroll: false });
  }

  function toggleTag(tag: string) {
    router.replace(buildHref({ tag: activeTag === tag ? null : tag }), {
      scroll: false,
    });
  }

  function surpriseMe() {
    // Respect the active filters — pick from what's currently shown.
    if (filtered.length === 0) return;
    const pick = filtered[Math.floor(Math.random() * filtered.length)];
    router.push(`/mood/${pick.slug}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search moods, songs, or artists…"
          aria-label="Search moods"
          className="flex-1 rounded-full border border-black/[.12] bg-transparent px-5 py-3 text-base outline-none focus:border-black/40 dark:border-white/[.18] dark:focus:border-white/40"
        />
        <button
          type="button"
          onClick={surpriseMe}
          className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
        >
          🎲 Surprise me
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by tag">
          <button
            type="button"
            onClick={() => toggleTag(activeTag ?? "")}
            aria-pressed={!activeTag}
            disabled={!activeTag}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !activeTag
                ? "bg-foreground text-background"
                : "border border-black/[.12] text-zinc-600 hover:border-black/40 dark:border-white/[.18] dark:text-zinc-300 dark:hover:border-white/40"
            }`}
          >
            All
          </button>
          {tags.map((tag) => {
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={isActive}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "border border-black/[.12] text-zinc-600 hover:border-black/40 dark:border-white/[.18] dark:text-zinc-300 dark:hover:border-white/40"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-zinc-500 dark:text-zinc-400">
          No moods match your search.
        </p>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mood) => (
            <Link
              key={mood.slug}
              href={`/mood/${mood.slug}`}
              className={`group flex flex-col justify-between rounded-2xl bg-gradient-to-br ${mood.gradient} p-6 text-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg`}
            >
              <span className="text-4xl" aria-hidden>
                {mood.emoji}
              </span>
              <div className="mt-10">
                <h2 className="text-2xl font-semibold">{mood.name}</h2>
                <p className="text-sm text-white/80">{mood.tagline}</p>
              </div>
              <span className="mt-4 text-sm font-medium text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                {mood.tracks.length} tracks →
              </span>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
