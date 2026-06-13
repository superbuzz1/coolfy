import { moods } from "@/lib/moods";
import MoodBrowser from "./MoodBrowser";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-16 font-sans">
      <header className="flex flex-col gap-3 text-center sm:text-left">
        <h1 className="text-5xl font-bold tracking-tight">Coolfy</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Pick a mood. We&apos;ll set the vibe.
        </p>
      </header>

      <MoodBrowser moods={moods} />
    </main>
  );
}
