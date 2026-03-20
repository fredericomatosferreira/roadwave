const statusConfig = {
  planned: { label: "Planned", className: "bg-gray-100 text-gray-600" },
  in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
  done: { label: "Done", className: "bg-green-100 text-green-700" },
} as const;

export default function StatusBadge({
  status,
}: {
  status: "planned" | "in_progress" | "done";
}) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
