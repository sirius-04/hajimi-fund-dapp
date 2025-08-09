export default function getStatusText(statusType: string, status: number) {
  const programStatuses = ["Pending", "Active", "Expired", "Cancelled", "Completed"];
  const requestStatuses = ["Pending", "Approved", "Rejected", "Expired", "Completed"];

  if (statusType == "program") {
    return programStatuses[status] ?? "Unknown";
  } else if (statusType == "request") {
    return requestStatuses[status] ?? "Unknown";
  }
}
