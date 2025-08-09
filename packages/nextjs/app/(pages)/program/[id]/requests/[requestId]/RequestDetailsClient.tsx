"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { formatEther } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Card, Carousel } from "~~/components/ui/apple-cards-carousel";
import { Button } from "~~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/ui/dialog";
import abi from "~~/contracts/ScholarshipProgram.json";
import { getIpfsUrl } from "~~/func/ipfs";

function RequestDetailsClient({ requestId }: { requestId: string }) {
  interface Request {
    id: bigint;
    title: string;
    description: string;
    value: bigint;
    mediaCIDs: string[];
    approvalCount: bigint;
    rejectCount: bigint;
    status: number; // or bigint if uint8 returned as bigint
    createdAt: bigint;
    votingDeadline: bigint;
  }
  const params = useParams();
  const programId = params.id as `0x${string}`;
  const account = useAccount();
  const { data } = useReadContract({
    address: programId,
    abi: abi,
    functionName: "getRequest",
    args: [requestId],
  });

  let mediaUrls: { src: string }[] = [];
  let title;
  let description;
  let status;

  if (data) {
    const request: Request = data as Request;

    title = request.title;
    description = request.description;
    const valueEther = Number(formatEther(request.value));
    const createdDate = new Date(Number(request.createdAt) * 1000);
    const votingDeadlineDate = new Date(Number(request.votingDeadline) * 1000);
    status = request.status;

    mediaUrls = request.mediaCIDs.map(cid => ({ src: getIpfsUrl(cid) }));

    // status, approvalCount, rejectCount are numbers/bigints you can display
  }

  console.log(mediaUrls);
  const cards = mediaUrls.map((card, index) => <Card key={card.src} card={card} index={index} />);
  const isSingleImage = mediaUrls.length === 1;
  const { data: voteData } = useReadContract({
    address: programId,
    abi: abi,
    functionName: "votesByRequest",
    args: [requestId, account.address],
  });

  const { data: creator } = useReadContract({
    address: programId,
    abi: abi,
    functionName: "creator",
  });
  const isCreator = creator == account.address;

  const { data: isApproverRaw } = useReadContract({
    address: programId,
    abi: abi,
    functionName: "isApprover",
    args: [account.address],
  });
  const isApprover = Boolean(isApproverRaw);
  const { writeContractAsync } = useWriteContract();

  function handleApprove() {
    const promise = writeContractAsync({
      abi: abi,
      address: programId,
      functionName: "vote",
      args: [requestId, true],
    });

    toast.promise(promise, {
      loading: "Voting",
      success: () => "Voted!",
      error: "Error",
    });
  }

  function handleReject() {
    const promise = writeContractAsync({
      abi: abi,
      address: programId,
      functionName: "vote",
      args: [requestId, false],
    });

    toast.promise(promise, {
      loading: "Voting",
      success: () => "Voted!",
      error: "Error",
    });
  }

  function handleFinalize() {
    const promise = writeContractAsync({
      abi: abi,
      address: programId,
      functionName: "finalizeRequest",
      args: [requestId],
    });

    toast.promise(promise, {
      loading: "Finalizing",
      success: () => "Finalized!",
      error: "Error",
    });
  }

  const voteButtons = (
    <div className="mt-8 flex justify-end gap-4 px-10">
      <Dialog>
        <DialogTrigger>
          <Button variant="outline" className="w-28">
            Approve
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>Are you really sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleApprove}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger>
          <Button variant="destructive" className="w-28">
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>Are you really sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleReject} variant="destructive">
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="w-full h-full py-20">
      <div className="flex justify-between items-center  max-w-7xl  mt-5 gap-3">
        <Link href={`/program/${programId}/requests`} className="z-10 mx-24 ">
          <button className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 cursor-pointer">
            <ArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
          </button>
        </Link>
        <h2 className="w-full text-center md:text-5xl font-bold text-neutral-800 dark:text-neutral-200">{title}</h2>
      </div>
      {isSingleImage ? (
        <div className="max-w-7xl mx-auto px-10 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Image */}
          <img src={mediaUrls[0].src} alt="Request" className="w-120 h-auto rounded-xl shadow-lg object-cover" />

          {/* Right: Description */}
          <div>
            <h2 className="font-bold text-2xl underline">Request Description</h2>
            <div className="mt-4 text-muted-foreground">{description}</div>
            {isApprover && voteData == 0 && voteButtons}
            {status == 1 && isCreator && (
              <Button variant="default" onClick={handleFinalize} className="mt-10">
                Finalize Request
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <Carousel items={cards} />
          <div className="max-w-7xl mx-auto px-10 py-10">
            <h2 className="font-bold text-2xl underline">Request Description</h2>
            <div className="mt-4 text-muted-foreground">{description}</div>
            {isApprover && voteData == 0 && voteButtons}
            {status == 1 && isCreator && (
              <Button variant="default" onClick={handleFinalize}>
                Finalize Request
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default RequestDetailsClient;
