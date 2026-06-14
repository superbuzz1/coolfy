export type Track = {
  title: string;
  artist: string;
};

export type Mood = {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  /** Tailwind gradient classes used for the mood card / header. */
  gradient: string;
  /** Filter categories this mood belongs to. */
  tags: string[];
  tracks: Track[];
};

export const moods: Mood[] = [
  {
    slug: "chill",
    name: "Chill",
    emoji: "🌊",
    tagline: "Lean back and let it drift.",
    gradient: "from-sky-400 to-cyan-300",
    tags: ["relaxed"],
    tracks: [
      { title: "Slow Tide", artist: "Marlow" },
      { title: "Paper Boats", artist: "Hana Lune" },
      { title: "Cloudline", artist: "Oslo Park" },
      { title: "Warm Static", artist: "Field Notes" },
      { title: "Driftwood", artist: "Sea Glass" },
    ],
  },
  {
    slug: "focus",
    name: "Focus",
    emoji: "🎯",
    tagline: "Deep work, no distractions.",
    gradient: "from-indigo-500 to-violet-400",
    tags: ["productive"],
    tracks: [
      { title: "Flow State", artist: "Kemp" },
      { title: "Long Hours", artist: "Atlas Room" },
      { title: "Quiet Engine", artist: "Norr" },
      { title: "Pages", artist: "Della" },
      { title: "Deep End", artist: "Vesper" },
    ],
  },
  {
    slug: "hype",
    name: "Hype",
    emoji: "⚡",
    tagline: "Turn it all the way up.",
    gradient: "from-orange-500 to-pink-500",
    tags: ["energetic"],
    tracks: [
      { title: "Redline", artist: "Pulse Theory" },
      { title: "Ignition", artist: "Kova" },
      { title: "Big Lights", artist: "The Voltage" },
      { title: "Overdrive", artist: "Sabre" },
      { title: "Run It Back", artist: "Mile High" },
    ],
  },
  {
    slug: "cozy",
    name: "Cozy",
    emoji: "🕯️",
    tagline: "Soft light, warm sound.",
    gradient: "from-amber-400 to-rose-300",
    tags: ["reflective"],
    tracks: [
      { title: "Knit", artist: "Maple Street" },
      { title: "Slow Sunday", artist: "Wren" },
      { title: "Kettle", artist: "Home Body" },
      { title: "Wool Socks", artist: "Pine & Oak" },
      { title: "Low Lamp", artist: "Ember" },
    ],
  },
  {
    slug: "melancholy",
    name: "Melancholy",
    emoji: "🌧️",
    tagline: "For the bittersweet evenings.",
    gradient: "from-slate-500 to-blue-400",
    tags: ["reflective"],
    tracks: [
      { title: "Last Train", artist: "Greyling" },
      { title: "Empty Rooms", artist: "Sora" },
      { title: "Rain Check", artist: "November" },
      { title: "Fade Slow", artist: "Lowtide" },
      { title: "Old Photographs", artist: "Adair" },
    ],
  },
  {
    slug: "sunrise",
    name: "Sunrise",
    emoji: "🌅",
    tagline: "Ease into a brand new day.",
    gradient: "from-yellow-300 to-orange-400",
    tags: ["productive", "relaxed"],
    tracks: [
      { title: "First Light", artist: "Coastal" },
      { title: "Morning Glow", artist: "Petra" },
      { title: "Open Window", artist: "Lark" },
      { title: "Slow Coffee", artist: "Verano" },
      { title: "Golden Hour", artist: "Fielder" },
    ],
  },
];

/** Unique, sorted list of all tags across moods — for filter UI. */
export const allTags: string[] = Array.from(
  new Set(moods.flatMap((mood) => mood.tags)),
).sort();

export function getMood(slug: string): Mood | undefined {
  return moods.find((mood) => mood.slug === slug);
}

/** YouTube search URL for a single track — resolves without an API key. */
export function youtubeSearchUrl(track: Track): string {
  const q = encodeURIComponent(`${track.title} ${track.artist}`);
  return `https://www.youtube.com/results?search_query=${q}`;
}

/** Spotify search URL for a single track. */
export function spotifySearchUrl(track: Track): string {
  const q = encodeURIComponent(`${track.title} ${track.artist}`);
  return `https://open.spotify.com/search/${q}`;
}

/** YouTube search for the whole mood as a playlist-style query. */
export function moodYoutubeUrl(mood: Mood): string {
  const q = encodeURIComponent(`${mood.name} playlist ${mood.tagline}`);
  return `https://www.youtube.com/results?search_query=${q}`;
}
