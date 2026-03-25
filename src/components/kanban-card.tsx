"use client";

import type { Card } from "@/lib/types/database";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import StatusBadge from "./status-badge";

export default function KanbanCard({
  card,
  onClick,
  readonly = false,
  dark = false,
}: {
  card: Card;
  onClick?: () => void;
  readonly?: boolean;
  dark?: boolean;
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

  const colorMap: Record<string, string> = {
    blue: "border-l-blue-400",
    green: "border-l-green-400",
    red: "border-l-red-400",
    yellow: "border-l-yellow-400",
    purple: "border-l-purple-400",
    pink: "border-l-pink-400",
  };

  const colorClass = card.color ? colorMap[card.color] ?? "" : "";

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
      className={`rounded-lg border p-3 shadow-sm ${
        dark
          ? "border-gray-700 bg-gray-800"
          : "border-gray-200 bg-white"
      } ${colorClass ? `border-l-[3px] ${colorClass}` : ""} ${isDragging ? "opacity-50 shadow-lg" : ""} ${
        !readonly ? "cursor-grab active:cursor-grabbing" : ""
      } ${onClick ? `cursor-pointer ${dark ? "hover:border-gray-600" : "hover:border-gray-300"}` : ""}`}
    >
      <StatusBadge status={card.status} />
      <h4 className={`mt-2 text-sm font-medium ${dark ? "text-gray-100" : "text-gray-900"}`}>{card.title}</h4>
      {card.description && (
        <p className={`mt-1 text-xs line-clamp-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>
          {card.description}
        </p>
      )}
      {card.tag && (
        <span className={`mt-2 inline-block rounded px-1.5 py-0.5 text-xs ${dark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
          {card.tag}
        </span>
      )}
    </div>
  );
}
