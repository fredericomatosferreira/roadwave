"use client";

import { createClient } from "@/lib/supabase/client";
import type { Roadmap, Column, Card } from "@/lib/types/database";
import { useState, useCallback } from "react";
import Link from "next/link";
import KanbanBoard from "@/components/kanban-board";
import CardSidebar from "@/components/card-sidebar";

export default function EditorClient({
  roadmap: initialRoadmap,
  initialColumns,
  initialCards,
}: {
  roadmap: Roadmap;
  initialColumns: Column[];
  initialCards: Card[];
}) {
  const supabase = createClient();
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [columns, setColumns] = useState(initialColumns);
  const [cards, setCards] = useState(initialCards);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [copied, setCopied] = useState(false);

  // ---- Roadmap title ----
  async function updateTitle(title: string) {
    setRoadmap({ ...roadmap, title });
    await supabase.from("roadmaps").update({ title }).eq("id", roadmap.id);
  }

  // ---- Visibility ----
  async function updateVisibility(visibility: Roadmap["visibility"]) {
    setRoadmap({ ...roadmap, visibility });
    await supabase
      .from("roadmaps")
      .update({ visibility })
      .eq("id", roadmap.id);
  }

  // ---- Columns ----
  async function addColumn() {
    const position = columns.length;
    const { data } = await supabase
      .from("columns")
      .insert({
        roadmap_id: roadmap.id,
        title: "New Column",
        position,
      })
      .select()
      .single();
    if (data) setColumns([...columns, data as Column]);
  }

  async function renameColumn(columnId: string, title: string) {
    setColumns(columns.map((c) => (c.id === columnId ? { ...c, title } : c)));
    await supabase.from("columns").update({ title }).eq("id", columnId);
  }

  async function deleteColumn(columnId: string) {
    if (!confirm("Delete this column and all its cards?")) return;
    await supabase.from("columns").delete().eq("id", columnId);
    setColumns(columns.filter((c) => c.id !== columnId));
    setCards(cards.filter((c) => c.column_id !== columnId));
    if (editingCard?.column_id === columnId) setEditingCard(null);
  }

  // ---- Cards ----
  async function addCard(columnId: string) {
    const columnCards = cards.filter((c) => c.column_id === columnId);
    const position = columnCards.length;
    const { data } = await supabase
      .from("cards")
      .insert({
        roadmap_id: roadmap.id,
        column_id: columnId,
        title: "New Card",
        position,
      })
      .select()
      .single();
    if (data) setCards([...cards, data as Card]);
  }

  const moveCard = useCallback(
    async (cardId: string, newColumnId: string, newPosition: number) => {
      setCards((prev) => {
        const card = prev.find((c) => c.id === cardId);
        if (!card) return prev;

        const updated = prev.map((c) => {
          if (c.id === cardId) {
            return { ...c, column_id: newColumnId, position: newPosition };
          }
          return c;
        });
        return updated;
      });

      await supabase
        .from("cards")
        .update({ column_id: newColumnId, position: newPosition })
        .eq("id", cardId);
    },
    [supabase]
  );

  async function saveCard(updates: Partial<Card>) {
    if (!editingCard) return;
    const updatedCard = { ...editingCard, ...updates };
    setCards(cards.map((c) => (c.id === editingCard.id ? updatedCard : c)));
    setEditingCard(updatedCard as Card);
    await supabase
      .from("cards")
      .update(updates)
      .eq("id", editingCard.id);
  }

  async function deleteCard() {
    if (!editingCard) return;
    await supabase.from("cards").delete().eq("id", editingCard.id);
    setCards(cards.filter((c) => c.id !== editingCard.id));
    setEditingCard(null);
  }

  // ---- Embed code ----
  function copyEmbedCode() {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const code = `<iframe src="${appUrl}/embed/${roadmap.slug}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            &larr; Dashboard
          </Link>
          <input
            type="text"
            value={roadmap.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="border-none bg-transparent text-lg font-bold text-gray-900 outline-none focus:ring-1 focus:ring-blue-400 rounded px-2 py-1"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSharePanel(!showSharePanel)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Share
          </button>
          <button
            onClick={copyEmbedCode}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {copied ? "Copied!" : "Copy embed code"}
          </button>
          <Link
            href={`/roadmap/${roadmap.slug}`}
            target="_blank"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View public page
          </Link>
          <button
            onClick={addColumn}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Column
          </button>
        </div>
      </div>

      {/* Share panel */}
      {showSharePanel && (
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Share Settings
          </h3>
          <div className="flex gap-3">
            {(["public", "unlisted", "private"] as const).map((v) => (
              <button
                key={v}
                onClick={() => updateVisibility(v)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                  roadmap.visibility === v
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {roadmap.visibility === "public" &&
              "Anyone with the link can view this roadmap."}
            {roadmap.visibility === "unlisted" &&
              "Accessible by direct link only. Not indexed."}
            {roadmap.visibility === "private" &&
              "Only you can view this roadmap. Embeds show a placeholder."}
          </p>
        </div>
      )}

      {/* Kanban board */}
      <div className="flex-1 overflow-auto">
        <KanbanBoard
          columns={columns}
          cards={cards}
          onCardClick={(card) => setEditingCard(card)}
          onAddCard={addCard}
          onMoveCard={moveCard}
          onRenameColumn={renameColumn}
          onDeleteColumn={deleteColumn}
        />
      </div>

      {/* Card sidebar */}
      {editingCard && (
        <CardSidebar
          card={editingCard}
          onSave={saveCard}
          onDelete={deleteCard}
          onClose={() => setEditingCard(null)}
        />
      )}
    </div>
  );
}
