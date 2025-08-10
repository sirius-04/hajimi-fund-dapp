import RequestDetailsClient from "./RequestDetailsClient";

export default async function RequestDetails({ params }: { params: Promise<{ requestId: string }> }) {
  const requestId = (await params).requestId;

  return <RequestDetailsClient requestId={requestId}></RequestDetailsClient>;
}
