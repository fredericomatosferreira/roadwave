import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EmbedClient from "./embed-client";
import type { Roadmap, Column, Card } from "@/lib/types/database";

export default async function EmbedPage({
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
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-600">
            Private Roadmap
          </p>
          <p className="mt-1 text-sm text-gray-400">
            This roadmap is private.
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
    <EmbedClient
      roadmapId={roadmap.id}
      initialColumns={(columns as Column[]) ?? []}
      initialCards={(cards as Card[]) ?? []}
    />
  );
}
