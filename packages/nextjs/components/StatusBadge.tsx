import React from "react";
import { Badge } from "./ui/badge";

interface Props {
  status: string | undefined;
}

const StatusBadge = ({ status = "pending" }: Props) => {
  // Define a mapping of status to Tailwind color classes
  const statusColors: Record<string, string> = {
    Pending: "bg-orange-500 text-white",
    Active: "bg-green-500 text-white",
    Expired: "bg-gray-500 text-white",
    Cancelled: "bg-red-500 text-white",
    Completed: "bg-blue-500 text-white",
  };

  const colorClass = statusColors[status] || "bg-violet-500 text-white"; // fallback color

  return <Badge className={`h-6 ${colorClass}`}>{status}</Badge>;
};

export default StatusBadge;
