"use client";

import React from "react";
import Link from "next/link";
import { FaEthereum } from "react-icons/fa";
import { formatEther, getAddress } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import StatusBadge from "~~/components/StatusBadge";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import GradientText from "~~/components/ui/GradientText";
import { Modal, ModalTrigger } from "~~/components/ui/animated-modal";
import { AnimatedTestimonials } from "~~/components/ui/animated-testimonials";
import { BackgroundBeams } from "~~/components/ui/background-beams";
import { BackgroundGradient } from "~~/components/ui/background-gradient";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/card";
import { PlaceholdersAndVanishInput } from "~~/components/ui/placeholders-and-vanish-input";
import { Progress } from "~~/components/ui/progress";
import { Skeleton } from "~~/components/ui/skeleton";
import programAbi from "~~/contracts/ScholarshipProgram.json";
import getStatusText from "~~/func/getStatusText";
import { getIpfsUrl } from "~~/func/ipfs";

function ProgramDetailsClient({ address }: { address: `0x${string}` }) {
  const account = useAccount();
  const { data, isPending } = useReadContracts({
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

  return (
    <div className="w-full h-full py-20">
      <BackgroundBeams />
      {isPending ? (
        <div className="max-w-6xl pl-4 mt-5 mx-auto text-center">
          <Skeleton className="h-14 w-full mx-auto mb-5" />
        </div>
      ) : (
        <h2 className="max-w-6xl pl-4 mt-5 mx-auto text-xl text-center md:text-5xl font-bold text-neutral-800 dark:text-neutral-200">
          {title}
        </h2>
      )}

      {isPending ? (
        <div className="max-w-7xl pl-4 mx-auto mt-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <p className="text-muted-foreground">Fundraising organised by</p>
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-6 w-24 mt-2 mx-auto" />
        </div>
      ) : (
        <div className="max-w-7xl pl-4 mx-auto mt-2 text-center text-base md:text-xl text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center justify-center gap-4">
            <p className="text-base">Fundraising organised by</p>
            <div className="flex items-center space-x-1">
              <BlockieAvatar address={_creator} size={20} />
              <p className="text-base">
                {_creator?.slice(0, 6)}...{_creator?.slice(-4)}
              </p>
            </div>
          </div>
          <StatusBadge status={statusText!} />
        </div>
      )}

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto flex flex-col justify-between md:flex-row gap-5 items-center px-20 py-10">
        {isPending ? (
          <Skeleton className="h-96 w-96 rounded-xl" />
        ) : (
          <div>
            <AnimatedTestimonials testimonials={testimonials} showAddFile={isCreator} address={address} />
          </div>
        )}
        {/* Donate Card */}
        <div className="relative w-95 self-start mt-8">
          <BackgroundGradient className="bg-white dark:bg-zinc-900 rounded-[22px]">
            <Card className="w-full max-w-sm py-10 rounded-[22px]">
              {isPending ? (
                <>
                  <CardHeader>
                    <Skeleton className="h-8 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-20" />
                      <div className="flex -space-x-2">
                        {Array(3)
                          .fill(null)
                          .map((_, i) => (
                            <Skeleton key={i} className="h-6 w-6 rounded-full" />
                          ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col mt-6 gap-2">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle className="text-center text-4xl">
                      {balanceNum} <span className="text-sm">ETH</span>
                    </CardTitle>
                    <CardDescription className="flex justify-center">
                      <div className="flex items-center space-x-3">
                        <p>raised of</p>
                        <GradientText>{goalNum}</GradientText>
                        <p className="ml-3">ETH goals</p>
                      </div>
                    </CardDescription>
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
                            className="-translate-x-60 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-400 text-white z-30 cursor-pointer"
                            onClick={() => setShowInput(true)}
                          >
                            💵
                          </div>
                        </ModalTrigger>
                      </Modal>
                    )}

                    {isCreator && (
                      <Link href={`/program/${address}/requests`} className="w-full">
                        <Button variant="outline" className="w-full">
                          Create Request
                        </Button>
                      </Link>
                    )}

                    {isCreator && isContributor && (
                      <Link href={`/program/${address}/requests`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Requests
                        </Button>
                      </Link>
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
                          onSubmit={e => {
                            e.preventDefault();
                            setShowInput(false);
                          }}
                        />
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" onClick={() => setShowInput(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          </BackgroundGradient>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-5">
        <h2 className="font-bold text-2xl underline">Requestor Story</h2>
        {isPending ? (
          <Skeleton className="h-20 w-full mt-4 rounded-lg" />
        ) : (
          <div className="mt-4 text-muted-foreground">{description}</div>
        )}
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
