import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PublicBoardClient from "./public-board-client";
import type { Roadmap, Column, Card } from "@/lib/types/database";

export default async function PublicRoadmapPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();

  const { data: roadmapData } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!roadmapData) notFound();

  const roadmap = roadmapData as Roadmap;

  if (roadmap.visibility === "private") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Private Roadmap</h1>
          <p className="mt-2 text-gray-500">
            This roadmap is private and can only be viewed by its owner.
          </p>
        </div>
      </div>
    );
  }

  const { data: columns } = await supabase
    .from("columns")
    .select("*")
    .eq("roadmap_id", roadmap.id)
    .order("position");

  const { data: cards } = await supabase
    .from("cards")
    .select("*")
    .eq("roadmap_id", roadmap.id)
    .order("position");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{roadmap.title}</h1>
          <p className="mt-1 text-sm text-gray-400">
            Last updated {new Date(roadmap.updated_at).toLocaleDateString()}
          </p>
        </div>

        <PublicBoardClient
          columns={(columns as Column[]) ?? []}
          cards={(cards as Card[]) ?? []}
        />
      </div>

      <footer className="flex items-center justify-center gap-1.5 py-8 text-sm text-gray-400">
        Powered by
        <a href="/" className="text-blue-500 hover:text-blue-600 font-medium">
          RoadWave
        </a>
      </footer>
    </div>
  );
}
