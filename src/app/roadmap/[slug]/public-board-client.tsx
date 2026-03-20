"use client";

import type { Column, Card } from "@/lib/types/database";
import KanbanBoard from "@/components/kanban-board";

export default function PublicBoardClient({
  columns,
  cards,
}: {
  columns: Column[];
  cards: Card[];
}) {
  return <KanbanBoard columns={columns} cards={cards} readonly />;
}
