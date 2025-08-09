"use client";

import type { Abi } from "viem";
import { useReadContract, useReadContracts } from "wagmi";
import programAbiJson from "~~/contracts/ScholarshipProgram.json";
import deployedContracts from "~~/contracts/deployedContracts";
import getStatusText from "~~/func/getStatusText";

const programAbi = programAbiJson as Abi;

export function useDeployedPrograms() {
  const factoryAddress = deployedContracts[11155111].ScholarshipProgramFactory.address;
  const factoryAbi = deployedContracts[11155111].ScholarshipProgramFactory.abi;

  const { data: programAddresses } = useReadContract({
    abi: factoryAbi,
    address: factoryAddress,
    functionName: "getDeployedPrograms",
  });

  const addresses = programAddresses as `0x${string}`[] | undefined;

  const {
    data: programsData,
    isPending,
    error,
  } = useReadContracts({
    contracts:
      addresses?.flatMap(address => [
        {
          abi: programAbi,
          address,
          functionName: "title",
        },
        {
          abi: programAbi,
          address,
          functionName: "description",
        },
        {
          abi: programAbi,
          address,
          functionName: "goal",
        },
        {
          abi: programAbi,
          address,
          functionName: "status",
        },
        {
          abi: programAbi,
          address,
          functionName: "createdAt",
        },
        {
          abi: programAbi,
          address,
          functionName: "getContributors",
        },
      ]) ?? [],
  });

  const structuredPrograms =
    addresses?.map((address, idx) => {
      const baseIndex = idx * 6;
      return {
        address,
        title: programsData?.[baseIndex]?.result as string,
        description: programsData?.[baseIndex + 1]?.result as string,
        goal: programsData?.[baseIndex + 2]?.result as bigint,
        status: getStatusText("program", programsData?.[baseIndex + 3]?.result as number),
        createdAt: programsData?.[baseIndex + 4]?.result as bigint,
        contributors: programsData?.[baseIndex + 5]?.result as `0x${string}`[],
      };
    }) ?? [];

  return { structuredPrograms, isPending, error };
}
