"use client";

import type { Card } from "@/lib/types/database";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import StatusBadge from "./status-badge";

export default function KanbanCard({
  card,
  onClick,
  readonly = false,
}: {
  card: Card;
  onClick?: () => void;
  readonly?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    disabled: readonly,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`rounded-lg border border-gray-200 bg-white p-3 shadow-sm ${
        isDragging ? "opacity-50 shadow-lg" : ""
      } ${!readonly ? "cursor-grab active:cursor-grabbing" : ""} ${
        onClick ? "cursor-pointer hover:border-gray-300" : ""
      }`}
    >
      <StatusBadge status={card.status} />
      <h4 className="mt-2 text-sm font-medium text-gray-900">{card.title}</h4>
      {card.description && (
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
          {card.description}
        </p>
      )}
      {card.tag && (
        <span className="mt-2 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
          {card.tag}
        </span>
      )}
    </div>
  );
}
