import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex flex-col items-center">
            <Image src="/logo.svg" alt="" width={32} height={14} priority />
            <span className="text-xl font-bold tracking-tight text-gray-900">RoadWave</span>
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-balance text-5xl font-bold tracking-tight text-gray-900">
          Live roadmaps that embed anywhere
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
          Create Kanban-style product roadmaps and embed them in GitBook,
          Notion, or any documentation site. Changes update in real time —
          no page refresh needed.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Start for free
          </Link>
          <Link
            href="#features"
            className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            See how it works
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Everything you need
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">
            A purpose-built tool for product managers who want to keep
            stakeholders aligned without maintaining yet another tool.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg text-blue-600">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to share your roadmap?
          </h2>
          <p className="mt-4 text-gray-500">
            Create your first roadmap in under a minute. No credit card
            required.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} RoadWave. All rights reserved.
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Drag-and-drop Kanban",
    icon: "\u21C4",
    description:
      "Organize your roadmap into columns like Now, Next, and Later. Drag cards between columns as priorities shift.",
  },
  {
    title: "Embeddable anywhere",
    icon: "</\u200B>",
    description:
      "Copy a single iframe snippet and paste it into GitBook, Notion, Confluence, or any site that supports embeds.",
  },
  {
    title: "Real-time updates",
    icon: "\u26A1",
    description:
      "Every change you make is instantly reflected in all embedded views. No page refresh, no stale data.",
  },
  {
    title: "Share controls",
    icon: "\uD83D\uDD12",
    description:
      "Set roadmaps to Public, Unlisted, or Private. Control exactly who can see what.",
  },
  {
    title: "Status badges",
    icon: "\u25CF",
    description:
      "Tag cards as Planned, In Progress, or Done with color-coded badges so stakeholders can see progress at a glance.",
  },
  {
    title: "Deploy anywhere",
    icon: "\u25B2",
    description:
      "Built on Next.js and Supabase. Deploy to Vercel in one click and scale as your team grows.",
  },
];
