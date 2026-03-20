"use client";

import { createClient } from "@/lib/supabase/client";
import type { Roadmap } from "@/lib/types/database";
import { templates, type RoadmapTemplate } from "@/lib/templates";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardClient({
  roadmaps: initialRoadmaps,
  userEmail,
}: {
  roadmaps: Roadmap[];
  userEmail: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState(initialRoadmaps);
  const [creating, setCreating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  async function createFromTemplate(template: RoadmapTemplate) {
    setCreating(true);
    setShowTemplates(false);
    const slug = `roadmap-${Date.now().toString(36)}`;
    const userId = (await supabase.auth.getUser()).data.user!.id;
    const title =
      template.id === "empty" ? "Untitled Roadmap" : template.name;

    const { data, error } = await supabase
      .from("roadmaps")
      .insert({ title, slug, user_id: userId })
      .select("id, slug")
      .single();

    if (error || !data) {
      console.error("Failed to create roadmap:", error);
      alert(error?.message ?? "Failed to create roadmap");
      setCreating(false);
      return;
    }

    const roadmapId = (data as { id: string; slug: string }).id;

    // Create columns and cards from template
    for (let colIdx = 0; colIdx < template.columns.length; colIdx++) {
      const col = template.columns[colIdx];
      const { data: colData, error: colError } = await supabase
        .from("columns")
        .insert({ roadmap_id: roadmapId, title: col.title, position: colIdx })
        .select("id")
        .single();

      if (colError || !colData) {
        console.error("Failed to create column:", colError);
        continue;
      }

      const columnId = (colData as { id: string }).id;

      if (col.cards.length > 0) {
        const cardInserts = col.cards.map((card, cardIdx) => ({
          roadmap_id: roadmapId,
          column_id: columnId,
          title: card.title,
          description: card.description,
          status: card.status,
          tag: card.tag,
          position: cardIdx,
        }));
        const { error: cardError } = await supabase
          .from("cards")
          .insert(cardInserts);
        if (cardError) console.error("Failed to create cards:", cardError);
      }
    }

    router.push(`/editor/${roadmapId}`);
  }

  async function deleteRoadmap(id: string) {
    if (!confirm("Delete this roadmap? This cannot be undone.")) return;
    await supabase.from("roadmaps").delete().eq("id", id);
    setRoadmaps(roadmaps.filter((r) => r.id !== id));
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Image src="/logo.svg" alt="RoadWave" width={140} height={35} />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Roadmaps</h1>
          <button
            onClick={() => setShowTemplates(true)}
            disabled={creating}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? "Creating..." : "New Roadmap"}
          </button>
        </div>

        {roadmaps.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-lg text-gray-400">No roadmaps yet</p>
            <p className="mt-2 text-sm text-gray-400">
              Create your first roadmap to get started.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <Link
                    href={`/editor/${roadmap.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {roadmap.title}
                  </Link>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      roadmap.visibility === "public"
                        ? "bg-green-50 text-green-700"
                        : roadmap.visibility === "unlisted"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {roadmap.visibility}
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  /{roadmap.slug}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href={`/editor/${roadmap.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/roadmap/${roadmap.slug}`}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    target="_blank"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => deleteRoadmap(roadmap.id)}
                    className="text-sm font-medium text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  Updated{" "}
                  {new Date(roadmap.updated_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Template picker modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Roadmap
              </h2>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                &times;
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Start from scratch or pick a template to get going faster.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => createFromTemplate(template)}
                  disabled={creating}
                  className="group rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300 hover:bg-blue-50/50 transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {template.id === "empty" && "\u2795"}
                      {template.id === "product-launch" && "\uD83D\uDE80"}
                      {template.id === "quarterly-planning" && "\uD83D\uDCC5"}
                      {template.id === "bug-triage" && "\uD83D\uDC1B"}
                    </span>
                    <h3 className="font-semibold text-gray-900">
                      {template.name}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500">
                    {template.description}
                  </p>
                  <div className="mt-3 flex gap-1.5 flex-wrap">
                    {template.columns.map((col) => (
                      <span
                        key={col.title}
                        className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                      >
                        {col.title}
                        {col.cards.length > 0 && ` (${col.cards.length})`}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
