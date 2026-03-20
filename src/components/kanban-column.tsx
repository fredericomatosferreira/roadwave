"use client";

import type { Card, Column } from "@/lib/types/database";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./kanban-card";

export default function KanbanColumn({
  column,
  cards,
  onCardClick,
  onAddCard,
  onRenameColumn,
  onDeleteColumn,
  readonly = false,
  embed = false,
}: {
  column: Column;
  cards: Card[];
  onCardClick?: (card: Card) => void;
  onAddCard?: () => void;
  onRenameColumn?: (title: string) => void;
  onDeleteColumn?: () => void;
  readonly?: boolean;
  embed?: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className={`flex flex-col rounded-xl bg-gray-100/80 p-3 ${embed ? "min-w-0" : "w-72 shrink-0"}`}>
      {/* Column header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!readonly && onRenameColumn ? (
            <input
              type="text"
              value={column.title}
              onChange={(e) => onRenameColumn(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-gray-700 outline-none focus:ring-1 focus:ring-blue-400 rounded px-1"
            />
          ) : (
            <h3 className="text-sm font-bold text-gray-700">{column.title}</h3>
          )}
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">
            {cards.length}
          </span>
        </div>
        {!readonly && onDeleteColumn && (
          <button
            onClick={onDeleteColumn}
            className="text-gray-400 hover:text-red-500 text-sm"
            title="Delete column"
          >
            &times;
          </button>
        )}
      </div>

      {/* Cards */}
      <div ref={setNodeRef} className="flex min-h-[40px] flex-1 flex-col gap-2">
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onClick={onCardClick ? () => onCardClick(card) : undefined}
              readonly={readonly}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <p className="py-4 text-center text-xs text-gray-400">
            No cards yet
          </p>
        )}
      </div>

      {/* Add card button */}
      {!readonly && onAddCard && (
        <button
          onClick={onAddCard}
          className="mt-2 w-full rounded-lg border border-dashed border-gray-300 py-2 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600"
        >
          + Add card
        </button>
      )}
    </div>
  );
}
