import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getMood,
  moodYoutubeUrl,
  moods,
  spotifySearchUrl,
  youtubeSearchUrl,
} from "@/lib/moods";

export function generateStaticParams() {
  return moods.map((mood) => ({ slug: mood.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mood = getMood(slug);
  if (!mood) return { title: "Mood not found — Coolfy" };
  return {
    title: `${mood.name} — Coolfy`,
    description: mood.tagline,
  };
}

export default async function MoodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mood = getMood(slug);

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
