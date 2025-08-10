import RequestDetailsClient from "./RequestDetailsClient";

export default async function RequestDetailsPage({ params }: { params: Promise<{ id: `0x${string}` }> }) {
  return <RequestDetailsClient address={(await params).id} />;
}
