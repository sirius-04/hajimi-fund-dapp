"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Brush,
  ChevronsLeft,
  ChevronsRight,
  GraduationCap,
  Landmark,
  MonitorSmartphone,
  Scroll,
  UserX,
} from "lucide-react";
import type { NextPage } from "next";
import { FaEthereum } from "react-icons/fa";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { ProgramCard } from "~~/components/ProgramCard";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~~/components/ui/card";
import { Skeleton } from "~~/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";
import { useDeployedPrograms } from "~~/hooks/useDeployedPrograms";

const Home: NextPage = () => {
  const { structuredPrograms, isPending } = useDeployedPrograms();
  const [isOpen, setIsOpen] = useState(true);
  const hasMountedOnce = useRef(false);
  const account = useAccount();

  // for right panel toggle
  useEffect(() => {
    if (isOpen) {
      hasMountedOnce.current = true;
    }
  }, [isOpen]);

  const programList =
    structuredPrograms?.map(p => ({
      id: p.address,
      title: p.title ?? "",
      description: p.description ?? "",
      badgeText: p.status ?? "",
      contributors: p.contributors ?? [],
      date: p.createdAt ? new Date(Number(p.createdAt) * 1000).toDateString() : "",
      price: p.goal ? formatEther(p.goal) : "0.00",
    })) ?? [];

  const contributedPrograms = programList.filter(
    p => !p.contributors.some(contributor => contributor === account.address),
  );

  return (
    <div className="relative w-full mt-18">
      <div className="flex  w-full ">
        {/* Left scrollable content */}
        <motion.div
          className="flex-shrink-0 w-full"
          initial={{ width: "70%" }}
          animate={{ width: isOpen ? "70%" : "100%" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-2 px-3 py-2 md:p-5">
            {/* ----- filter buttons ----- */}
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="cursor-pointer">
                  All
                </Button>
                {filterButtons.map((button, idx) => (
                  <Button key={idx} variant="outline" size="lg" className="cursor-pointer">
                    {button.icon}
                    {button.label}
                  </Button>
                ))}
              </div>

              {!isOpen && (
                <Button onClick={() => setIsOpen(true)} variant="outline" className=" cursor-pointer">
                  <ChevronsLeft />
                </Button>
              )}
            </div>

            {/* ----- Main content -----  */}
            <div className="h-full w-full mt-3">
              {!isPending && programList.length === 0 && (
                <p className="text-center text-muted-foreground mt-4">No programs found.</p>
              )}

              {isPending ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-[150px] w-full rounded-xl mb-3" />
                ))
              ) : (
                <ProgramCard data={programList} />
              )}
            </div>
          </div>
        </motion.div>

        {/* -----  right panel -----  */}
        <div className="fixed top-18">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="fixed z-0 right-0 top-18 h-full  px-3 py-2 md:p-5 hidden md:block "
                initial={hasMountedOnce.current ? { x: "100%" } : false}
                animate={{ x: 0, width: "30%" }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between">
                  {/* -----  action buttons -----  */}
                  <div className="flex gap-x-2">
                    {actionButtons.map((button, idx) => (
                      <Button variant="outline" className="cursor-pointer" key={idx}>
                        {button.icon}
                        {button.label}
                      </Button>
                    ))}
                  </div>
                  <Button variant="outline" className="cursor-pointer" onClick={() => setIsOpen(false)}>
                    <ChevronsRight />
                  </Button>
                </div>

                <div className="mt-4 max-h-[70%] h-full overflow-y-auto">
                  {isPending ? (
                    <div className="flex flex-col mt-4">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-20 w-full rounded-lg mb-2" />
                      ))}
                    </div>
                  ) : contributedPrograms.length > 0 ? (
                    <Table>
                      <TableHeader className="text-muted-foreground">
                        <TableRow>
                          <TableHead className="text-muted-foreground">Program</TableHead>
                          <TableHead className="text-muted-foreground text-right">ETH</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="cursor-pointer text-md">
                        {contributedPrograms.map((data, index) => (
                          <TableRow key={index} className="hover:underline h-16">
                            <TableCell className="font-medium">
                              <Link href={`/program/${data.id}`} className="block w-full h-full" key={index}>
                                <div className="flex gap-2 items-center">
                                  <BlockieAvatar address={data.id} size={25} />
                                  <p className="truncate max-w-xs">{data.title}</p>
                                </div>
                              </Link>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/program/${data.id}`} className="block w-full h-full" key={index}>
                                <div className="flex gap-2 items-center justify-end">
                                  <p>{data.price}</p>
                                  <div className="text-violet-400">
                                    <FaEthereum size="20" />
                                  </div>
                                </div>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Card className="mt-4">
                      <CardContent className="flex flex-col items-center justify-center text-center">
                        <UserX />
                        <p>No Contributions</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Home;

const filterButtons = [
  { icon: <MonitorSmartphone />, label: "Computer Science" },
  { icon: <Brush />, label: "Art" },
  { icon: <Landmark />, label: "Finance" },
  { icon: <Scroll />, label: "Degree" },
];

const actionButtons = [
  { icon: <GraduationCap />, label: "Program" },
  { icon: <Award />, label: "Top " },
];

const tableDate = [
  { programName: "Degree ABC Scholarship", eth: 1.0, id: 1 },
  { programName: "Degree ABC Scholarship", eth: 1.0, id: 2 },
  { programName: "Degree ABC Scholarship", eth: 1.0, id: 3 },
  { programName: "Degree ABC Scholarship", eth: 1.0, id: 4 },
  { programName: "Degree ABC Scholarship", eth: 1.0, id: 5 },
  { programName: "Degree ABC Scholarship", eth: 1.0, id: 6 },
  { programName: "Degree ABC Scholarship", eth: 1.0, id: 7 },
];
