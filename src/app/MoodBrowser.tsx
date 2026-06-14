"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Mood } from "@/lib/moods";

export default function MoodBrowser({
  moods: staticMoods,
  tags: staticTags,
}: {
  moods: Mood[];
  tags: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const activeTag = searchParams.get("tag");

  const [customMoods, setCustomMoods] = useState<Mood[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [tagsInput, setTagsInput] = useState("");
  const [gradient, setGradient] = useState("from-emerald-400 to-teal-500");
  const [tracks, setTracks] = useState<{ title: string; artist: string }[]>([
    { title: "", artist: "" }
  ]);

  // Load custom moods on mount
  useEffect(() => {
    const stored = localStorage.getItem("custom-moods");
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCustomMoods(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading custom moods", e);
      }
    }
  }, []);

  const allMoods = useMemo(() => [...staticMoods, ...customMoods], [staticMoods, customMoods]);

  const allTags = useMemo(() => {
    const set = new Set([...staticTags, ...customMoods.flatMap(m => m.tags)]);
    return Array.from(set).sort();
  }, [staticTags, customMoods]);

  // Build a new query string from the current params, applying updates.
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
    return allMoods.filter((mood) => {
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
  }, [allMoods, query, activeTag]);

  function setQuery(value: string) {
    router.replace(buildHref({ q: value }), { scroll: false });
  }

  function toggleTag(tag: string) {
    router.replace(buildHref({ tag: activeTag === tag ? null : tag }), {
      scroll: false,
    });
  }

  function surpriseMe() {
    if (filtered.length === 0) return;
    const pick = filtered[Math.floor(Math.random() * filtered.length)];
    router.push(`/mood/${pick.slug}`);
  }

  const handleAddTrack = () => {
    setTracks([...tracks, { title: "", artist: "" }]);
  };

  const handleRemoveTrack = (index: number) => {
    if (tracks.length === 1) return;
    setTracks(tracks.filter((_, i) => i !== index));
  };

  const handleTrackChange = (index: number, field: "title" | "artist", value: string) => {
    setTracks(
      tracks.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const handleCreateMood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tagline.trim()) return;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const allSlugs = allMoods.map((m) => m.slug);
    if (allSlugs.includes(slug)) {
      alert("A mood with a similar name already exists! Please choose another name.");
      return;
    }

    const newMood: Mood = {
      slug,
      name: name.trim(),
      emoji: emoji.trim() || "✨",
      tagline: tagline.trim(),
      gradient,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0),
      tracks: tracks.filter((t) => t.title.trim() && t.artist.trim())
    };

    const updatedCustom = [...customMoods, newMood];
    setCustomMoods(updatedCustom);
    localStorage.setItem("custom-moods", JSON.stringify(updatedCustom));

    setShowModal(false);
    setName("");
    setTagline("");
    setEmoji("✨");
    setTagsInput("");
    setGradient("from-emerald-400 to-teal-500");
    setTracks([{ title: "", artist: "" }]);
  };

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
        <div className="flex gap-2">
          <button
            type="button"
            onClick={surpriseMe}
            className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition-opacity hover:opacity-90 cursor-pointer"
          >
            🎲 Surprise me
          </button>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-full bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 font-medium transition-opacity hover:opacity-90 cursor-pointer"
          >
            ✨ Create vibe
          </button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by tag">
          <button
            type="button"
            onClick={() => toggleTag(activeTag ?? "")}
            aria-pressed={!activeTag}
            disabled={!activeTag}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              !activeTag
                ? "bg-foreground text-background"
                : "border border-black/[.12] text-zinc-600 hover:border-black/40 dark:border-white/[.18] dark:text-zinc-300 dark:hover:border-white/40"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => {
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={isActive}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors cursor-pointer ${
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

      {/* Create Mood Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-black/10 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 max-h-[85vh] overflow-y-auto">
            <h2 className="text-2xl font-bold tracking-tight">Create Custom Mood</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 mb-6 font-medium">Set your own vibe by combining emojis, gradients, and custom tracks.</p>
            
            <form onSubmit={handleCreateMood} className="flex flex-col gap-5">
              <div className="flex gap-4">
                <div className="w-24">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Emoji</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="w-full text-center rounded-2xl border border-black/[.12] bg-transparent px-3 py-2.5 text-xl outline-none focus:border-indigo-500 dark:border-white/[.18] dark:focus:border-indigo-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Mood Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dreamy, Coffee Shop"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-black/[.12] bg-transparent px-4 py-2.5 text-base outline-none focus:border-indigo-500 dark:border-white/[.18] dark:focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Tagline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Soft acoustic keys for a rainy day."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-2xl border border-black/[.12] bg-transparent px-4 py-2.5 text-base outline-none focus:border-indigo-500 dark:border-white/[.18] dark:focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Category Tags</label>
                  <input
                    type="text"
                    placeholder="e.g., relaxed, reflective"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full rounded-2xl border border-black/[.12] bg-transparent px-4 py-2.5 text-base outline-none focus:border-indigo-500 dark:border-white/[.18] dark:focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block">Comma-separated values</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Gradient Theme</label>
                  <select
                    value={gradient}
                    onChange={(e) => setGradient(e.target.value)}
                    className="w-full rounded-2xl border border-black/[.12] bg-white dark:bg-zinc-800 px-4 py-2.5 text-base outline-none focus:border-indigo-500 dark:border-white/[.18] dark:focus:border-indigo-500 text-zinc-800 dark:text-zinc-100"
                  >
                    <option value="from-emerald-400 to-teal-500">Emerald Mint</option>
                    <option value="from-purple-500 to-pink-500">Dreamy Orchid</option>
                    <option value="from-sky-400 to-cyan-300">Sky Chill</option>
                    <option value="from-indigo-500 to-violet-400">Deep Focus</option>
                    <option value="from-orange-500 to-pink-500">Hype Neon</option>
                    <option value="from-amber-400 to-rose-300">Warm Cozy</option>
                    <option value="from-violet-600 to-indigo-600">Royal Dusk</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Tracks List</label>
                  <button
                    type="button"
                    onClick={handleAddTrack}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    + Add Track
                  </button>
                </div>
                
                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                  {tracks.map((track, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        required
                        placeholder="Song Title"
                        value={track.title}
                        onChange={(e) => handleTrackChange(idx, "title", e.target.value)}
                        className="flex-1 rounded-xl border border-black/[.12] bg-transparent px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-white/[.18] dark:focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Artist"
                        value={track.artist}
                        onChange={(e) => handleTrackChange(idx, "artist", e.target.value)}
                        className="flex-1 rounded-xl border border-black/[.12] bg-transparent px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-white/[.18] dark:focus:border-indigo-500"
                      />
                      {tracks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTrack(idx)}
                          className="text-xs font-bold text-rose-500 hover:text-rose-700 px-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-black/10 dark:border-white/10 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-full border border-black/[.12] dark:border-white/[.18] px-5 py-3 font-medium text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-indigo-600 px-5 py-3 font-medium text-white transition-opacity hover:opacity-90 dark:bg-indigo-500 cursor-pointer"
                >
                  Save Mood
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
