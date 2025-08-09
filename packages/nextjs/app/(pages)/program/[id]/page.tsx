import ProgramDetailsClient from "./ProgramDetailsClient";

export default async function ProgramDetailsPage({ params }: { params: Promise<{ id: `0x${string}` }> }) {
  return <ProgramDetailsClient address={(await params).id} />;
}
