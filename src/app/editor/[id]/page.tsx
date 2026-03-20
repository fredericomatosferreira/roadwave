import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import EditorClient from "./editor-client";
import type { Roadmap, Column, Card } from "@/lib/types/database";

export default async function EditPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!roadmap) notFound();

  const { data: columns } = await supabase
    .from("columns")
    .select("*")
    .eq("roadmap_id", (roadmap as Roadmap).id)
    .order("position");

  const { data: cards } = await supabase
    .from("cards")
    .select("*")
    .eq("roadmap_id", (roadmap as Roadmap).id)
    .order("position");

  return (
    <EditorClient
      roadmap={roadmap as Roadmap}
      initialColumns={(columns as Column[]) ?? []}
      initialCards={(cards as Card[]) ?? []}
    />
  );
}
