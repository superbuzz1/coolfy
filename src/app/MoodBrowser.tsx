"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Mood } from "@/lib/moods";

export default function MoodBrowser({ moods }: { moods: Mood[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return moods;
    return moods.filter(
      (mood) =>
        mood.name.toLowerCase().includes(q) ||
        mood.tagline.toLowerCase().includes(q) ||
        mood.tracks.some(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.artist.toLowerCase().includes(q),
        ),
    );
  }, [moods, query]);

  function surpriseMe() {
    const pick = moods[Math.floor(Math.random() * moods.length)];
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

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-zinc-500 dark:text-zinc-400">
          No moods match &ldquo;{query}&rdquo;.
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
