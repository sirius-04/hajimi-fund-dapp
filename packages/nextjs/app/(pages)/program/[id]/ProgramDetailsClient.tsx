"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { formatEther, parseEther } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import { useWriteContract } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import RequestForm from "~~/components/ui/RequestForm";
import { Modal, ModalTrigger } from "~~/components/ui/animated-modal";
import { AnimatedTestimonials } from "~~/components/ui/animated-testimonials";
import { BackgroundGradient } from "~~/components/ui/background-gradient";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/ui/dialog";
import { PlaceholdersAndVanishInput } from "~~/components/ui/placeholders-and-vanish-input";
import { Progress } from "~~/components/ui/progress";
import programAbi from "~~/contracts/ScholarshipProgram.json";
import getStatusText from "~~/func/getStatusText";
import { getIpfsUrl } from "~~/func/ipfs";

function ProgramDetailsClient({ address }: { address: `0x${string}` }) {
  const account = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { data } = useReadContracts({
    contracts: [
      {
        abi: programAbi,
        address: address,
        functionName: "getProgramInfo",
      },
      {
        abi: programAbi,
        address: address,
        functionName: "getContributors",
      },
      {
        abi: programAbi,
        address: address,
        functionName: "hasContributed",
        args: [account.address],
      },
    ],
  });

  let title = "";
  let description = "";
  let mediaCIDs: string[] = [];
  let _creator: `0x${string}` = "0x0000000000000000000000000000000000000000";
  let goal = 0n;
  let balance = 0n;
  let status = 0;
  let approversCount = 0;
  let createdAt = 0;
  let expiryDate = 0;

  if (data && data[0]?.result) {
    [title, description, mediaCIDs, _creator, goal, balance, status, approversCount, createdAt, expiryDate] = data[0]
      .result as [string, string, string[], `0x${string}`, bigint, bigint, number, number, number, number];
  }

  const isCreator = account.address == _creator;
  const isContributor = data?.[2]?.result as boolean;
  const contributors = (data?.[1]?.result as `0x${string}`[]) ?? [];
  const goalNum = Number(formatEther(goal));
  const balanceNum = Number(formatEther(balance));
  const percentage = goalNum > 0 ? (balanceNum * 100) / goalNum : 0;
  const statusText = getStatusText("program", status);

  const testimonials: { src: string }[] = [];

  mediaCIDs.forEach(cid => {
    testimonials.push({ src: getIpfsUrl(cid) });
  });

  const [progress, setProgress] = React.useState(0);
  const [showInput, setShowInput] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  console.log(percentage);
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 500);

    return () => clearTimeout(timer);
  }, [percentage]);

  function handleContribute() {
    setShowInput(false);

    const promise = writeContractAsync({
      abi: programAbi,
      address: address,
      functionName: "contribute",
      value: parseEther(amount || "0"),
    });

    toast.promise(promise, {
      loading: "Contributing",
      success: () => "Contributed! Thanks!",
      error: "Error",
    });
  }

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mt-5 mx-auto text-xl text-center md:text-5xl font-bold text-neutral-800 dark:text-neutral-200">
        {title}
      </h2>
      <p className="max-w-7xl pl-4 mx-auto mt-2 text-center text-base md:text-xl text-neutral-600 dark:text-neutral-400">
        Fundraising organised by {_creator}
        <br />
        <Badge>{statusText}</Badge>
      </p>
      {/* Testimonials */}
      <div className="max-w-7xl mx-auto flex flex-col justify-between md:flex-row gap-5 items-start px-20 py-10">
        <div>
          <AnimatedTestimonials testimonials={testimonials} showAddFile={isCreator} address={address} />
        </div>
        {/* Donate Card */}
        <div className="relative w-95 self-start mt-8">
          <BackgroundGradient className="bg-white dark:bg-zinc-900 rounded-[22px]">
            <Card className="w-full max-w-sm py-10 rounded-[22px]">
              <CardHeader>
                <CardTitle className="text-center text-4xl">
                  {balanceNum} <span className="text-sm">ETH</span>
                </CardTitle>
                <CardDescription className="text-center">raised of {goalNum} ETH goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex-col gap-6 mt-2">
                  <Progress value={progress} className="w-full" />
                  <div className="flex justify-start mt-2">
                    <span className="text-sm font-semibold mr-2">Contributors:</span>
                    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                      {contributors.map(contributor => (
                        <BlockieAvatar key={contributor} address={contributor} size={24} />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col mt-6 gap-2">
                {!isCreator && (
                  <Modal>
                    <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white w-full flex justify-center group/modal-btn">
                      <div className="group-hover/modal-btn:translate-x-60 text-center transition duration-400">
                        {isContributor ? "Fund More" : "Fund their future"}
                      </div>
                      <div
                        className="-translate-x-60 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-400 text-white z-30"
                        onClick={() => setShowInput(true)}
                      >
                        💵
                      </div>
                    </ModalTrigger>
                  </Modal>
                )}

                {isCreator && statusText == "Active" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Create Request
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Create Request</DialogTitle>
                        <DialogDescription>Enter the request details</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <RequestForm address={address} />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {(isCreator || isContributor) && statusText != "Pending" && statusText != "Expired" && (
                  <Link href={`/program/${address}/requests`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Requests
                    </Button>
                  </Link>
                )}

                {isCreator && statusText == "Pending" && (
                  <p className="">Program will be activated after the goal is reached.</p>
                )}
              </CardFooter>
              {showInput && (
                <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-50 px-4 rounded-[22px] ">
                  <div className="bg-white dark:bg-zinc-900 p-3 shadow-lg w-full max-w-md">
                    <PlaceholdersAndVanishInput
                      placeholders={["Enter Amount in ETH", "Thanks for your contributions!"]}
                      onChange={e => {
                        setAmount(e.target.value);
                      }}
                      onSubmit={handleContribute}
                    />
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" onClick={() => setShowInput(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </BackgroundGradient>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-5">
        <h2 className="font-bold text-2xl underline">Requestor Story</h2>
        <div className="mt-4">{description}</div>
      </div>
    </div>
  );
}

export default ProgramDetailsClient;

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = ["Enter Amount in ETH", "Thanks for your contributions!"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />;
}
