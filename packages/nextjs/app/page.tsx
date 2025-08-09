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
} from "lucide-react";
import type { NextPage } from "next";
import { FaEthereum } from "react-icons/fa";
import { formatEther } from "viem";
import { ProgramCard } from "~~/components/ProgramCard";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";
import { useDeployedPrograms } from "~~/hooks/useDeployedPrograms";

const Home: NextPage = () => {
  const { structuredPrograms } = useDeployedPrograms();
  const [isOpen, setIsOpen] = useState(true);
  const hasMountedOnce = useRef(false);

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
      price: p.goal ? Number(formatEther(p.goal)).toFixed(2) : "0.00",
    })) ?? [];

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
              <ProgramCard data={programList} />
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

                {/* -----  table content -----  */}
                <div className="mt-4 max-h-[70%] h-full overflow-y-auto">
                  <Table>
                    <TableHeader className="text-muted-foreground">
                      <TableRow>
                        <TableHead className="text-muted-foreground">Program</TableHead>
                        <TableHead className="text-muted-foreground text-right">ETH</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="cursor-pointer text-md">
                      {tableDate.map((data, index) => (
                        <TableRow key={index} className="hover:underline h-16">
                          <TableCell className="font-medium">
                            <Link href={`/program/${data.id}`} className="block w-full h-full" key={index}>
                              <div className="flex gap-2 items-center">
                                <BlockieAvatar address="0xfc9400703dA075a14C9Cc4b87726FA90aDc055F2" size={25} />
                                <p>{data.programName}</p>
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/program/${data.id}`} className="block w-full h-full" key={index}>
                              <div className="flex gap-2 items-center justify-end">
                                <p>{data.eth}</p>
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
