"use client";

import type { Card, Column } from "@/lib/types/database";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useMemo } from "react";
import KanbanColumn from "./kanban-column";
import KanbanCard from "./kanban-card";

export default function KanbanBoard({
  columns,
  cards,
  onCardClick,
  onAddCard,
  onMoveCard,
  onRenameColumn,
  onDeleteColumn,
  readonly = false,
  embed = false,
  dark = false,
}: {
  columns: Column[];
  cards: Card[];
  onCardClick?: (card: Card) => void;
  onAddCard?: (columnId: string) => void;
  onMoveCard?: (cardId: string, newColumnId: string, newPosition: number) => void;
  onRenameColumn?: (columnId: string, title: string) => void;
  onDeleteColumn?: (columnId: string) => void;
  readonly?: boolean;
  embed?: boolean;
  dark?: boolean;
}) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const sortedColumns = useMemo(
    () => [...columns].sort((a, b) => a.position - b.position),
    [columns]
  );

  const cardsByColumn = useMemo(() => {
    const grouped = new Map<string, Card[]>();
    columns.forEach((col) => {
      grouped.set(
        col.id,
        cards.filter((c) => c.column_id === col.id).sort((a, b) => a.position - b.position)
      );
    });
    return grouped;
  }, [cards, columns]);

  function handleDragStart(event: DragStartEvent) {
    const card = cards.find((c) => c.id === event.active.id);
    if (card) setActiveCard(card);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    if (!onMoveCard) return;

    const { active, over } = event;
    if (!over) return;

    const activeCardId = active.id as string;
    const overId = over.id as string;

    // Determine target column and position
    const overCard = cards.find((c) => c.id === overId);
    const overColumn = columns.find((c) => c.id === overId);

    let targetColumnId: string;
    let targetPosition: number;

    if (overCard) {
      targetColumnId = overCard.column_id;
      targetPosition = overCard.position;
    } else if (overColumn) {
      targetColumnId = overColumn.id;
      const colCards = cardsByColumn.get(targetColumnId) ?? [];
      targetPosition = colCards.length;
    } else {
      return;
    }

    const sourceCard = cards.find((c) => c.id === activeCardId);
    if (!sourceCard) return;
    if (sourceCard.column_id === targetColumnId && sourceCard.position === targetPosition) return;

    onMoveCard(activeCardId, targetColumnId, targetPosition);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={embed ? "grid gap-3 p-2" : "flex gap-4 overflow-x-auto p-4 pb-8"} style={embed ? { gridTemplateColumns: `repeat(${sortedColumns.length}, minmax(0, 1fr))` } : undefined}>
        <SortableContext
          items={sortedColumns.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          {sortedColumns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={cardsByColumn.get(column.id) ?? []}
              onCardClick={onCardClick}
              onAddCard={onAddCard ? () => onAddCard(column.id) : undefined}
              onRenameColumn={
                onRenameColumn
                  ? (title) => onRenameColumn(column.id, title)
                  : undefined
              }
              onDeleteColumn={
                onDeleteColumn
                  ? () => onDeleteColumn(column.id)
                  : undefined
              }
              readonly={readonly}
              embed={embed}
              dark={dark}
            />
          ))}
        </SortableContext>
      </div>

      <DragOverlay>
        {activeCard ? (
          <KanbanCard card={activeCard} readonly dark={dark} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
