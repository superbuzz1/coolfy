"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import {
  moodYoutubeUrl,
  moods,
  spotifySearchUrl,
  youtubeSearchUrl,
  type Mood
} from "@/lib/moods";

export default function MoodPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [mood, setMood] = useState<Mood | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    // Set tab title dynamically
    let found = moods.find((m) => m.slug === slug);
    
    if (!found) {
      const stored = localStorage.getItem("custom-moods");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Mood[];
          found = parsed.find((m) => m.slug === slug);
        } catch (e) {
          console.error("Error loading custom moods", e);
        }
      }
    }
    
    if (found) {
      document.title = `${found.name} — Coolfy`;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMood(found);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-black/10 dark:border-white/10 border-t-zinc-600 dark:border-t-zinc-400 rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!mood) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12 font-sans">
      <Link
        href="/"
        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        ← All moods
      </Link>

      <header
        className={`flex flex-col gap-2 rounded-2xl bg-gradient-to-br ${mood.gradient} p-8 text-white shadow-sm`}
      >
        <span className="text-5xl" aria-hidden>
          {mood.emoji}
        </span>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{mood.name}</h1>
        <p className="text-white/80">{mood.tagline}</p>
        <a
          href={moodYoutubeUrl(mood)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-white/30"
        >
          ▶ Play this mood on YouTube
        </a>
      </header>

      <ol className="flex flex-col divide-y divide-black/[.06] dark:divide-white/[.08]">
        {mood.tracks.map((track, i) => (
          <li
            key={`${track.title}-${i}`}
            className="flex items-center gap-4 py-3"
          >
            <span className="w-6 text-right font-mono text-sm text-zinc-400">
              {i + 1}
            </span>
            <div className="flex flex-col">
              <span className="font-medium">{track.title}</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {track.artist}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <a
                href={youtubeSearchUrl(track)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Play ${track.title} on YouTube`}
                className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
              >
                YouTube
              </a>
              <a
                href={spotifySearchUrl(track)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Play ${track.title} on Spotify`}
                className="rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-500/20 dark:text-green-400"
              >
                Spotify
              </a>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
