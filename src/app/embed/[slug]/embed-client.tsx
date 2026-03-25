"use client";

import { createClient } from "@/lib/supabase/client";
import type { Column, Card } from "@/lib/types/database";
import { useEffect, useState } from "react";
import KanbanBoard from "@/components/kanban-board";

export default function EmbedClient({
  roadmapId,
  initialColumns,
  initialCards,
  theme = "light",
}: {
  roadmapId: string;
  initialColumns: Column[];
  initialCards: Card[];
  theme?: "light" | "dark" | "auto";
}) {
  const [columns, setColumns] = useState(initialColumns);
  const [cards, setCards] = useState(initialCards);
  const dark = theme === "dark";

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to card changes
    const cardsChannel = supabase
      .channel("embed-cards")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cards",
          filter: `roadmap_id=eq.${roadmapId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setCards((prev) => [...prev, payload.new as Card]);
          } else if (payload.eventType === "UPDATE") {
            setCards((prev) =>
              prev.map((c) =>
                c.id === (payload.new as Card).id
                  ? (payload.new as Card)
                  : c
              )
            );
          } else if (payload.eventType === "DELETE") {
            setCards((prev) =>
              prev.filter((c) => c.id !== (payload.old as Card).id)
            );
          }
        }
      )
      .subscribe();

    // Subscribe to column changes
    const columnsChannel = supabase
      .channel("embed-columns")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "columns",
          filter: `roadmap_id=eq.${roadmapId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setColumns((prev) => [...prev, payload.new as Column]);
          } else if (payload.eventType === "UPDATE") {
            setColumns((prev) =>
              prev.map((c) =>
                c.id === (payload.new as Column).id
                  ? (payload.new as Column)
                  : c
              )
            );
          } else if (payload.eventType === "DELETE") {
            setColumns((prev) =>
              prev.filter((c) => c.id !== (payload.old as Column).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      cardsChannel.unsubscribe();
      columnsChannel.unsubscribe();
    };
  }, [roadmapId]);

  const auto = theme === "auto";

  return (
    <div className={`overflow-auto p-2 ${dark ? "bg-gray-900" : auto ? "bg-transparent" : "bg-white"}`}>
      <KanbanBoard columns={columns} cards={cards} readonly embed dark={dark} transparent={auto} />
    </div>
  );
}
