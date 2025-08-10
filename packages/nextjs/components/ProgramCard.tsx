"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import GradientText from "./ui/GradientText";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Box, CalendarDays, Lock, Search, Settings, Sparkles } from "lucide-react";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { GlowingEffect } from "~~/components/ui/glowing-effect";
import { truncateText } from "~~/func/turncateText";

interface GridItemProps {
  id: string;
  title: string;
  description: string;
  badgeText?: string;
  contributors?: string[];
  date?: string;
  price?: string;
}

interface ProgramCardProps {
  data: GridItemProps[];
}

export function ProgramCard({ data }: ProgramCardProps) {
  return (
    <ul className="flex flex-col gap-3 w-full">
      {data.map((item, index) => (
        <GridItem key={index} {...item} />
      ))}
    </ul>
  );
}

interface GridItemProps {
  id: string;
  title: string;
  description: string;
  badgeText?: string;
  contributors?: string[]; // Ethereum addresses
  date?: string;
  price?: string;
}

export const GridItem = ({
  id,
  title,
  description,
  badgeText = "In progress",
  contributors = [],
  date = "Sat, Aug 9 2025",
  price = "1.00",
}: GridItemProps) => {
  const [maxDescLength, setMaxDescLength] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      setMaxDescLength(window.innerWidth < 768 ? 100 : 300); // mobile & desktop
    };

    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const truncatedDescription = truncateText(description, maxDescLength);

  return (
    <Link href={`/program/${id}`} className="w-full">
      <li className="list-none">
        <div className="relative h-full rounded-xl border p-2 md:rounded-3xl md:p-3 bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-[#1d1d1f] hover:bg-neutral-100 cursor-pointer transition-all duration-300 hover:scale-[1.02] ">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
          <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-2 md:p-2 ]">
            {/* Contain start here */}
            <div className="flex items-center justify-between w-full">
              {/* Left: Image */}
              <div className="min-w-24 min-h-24 w-24 h-24">
                <BlockieAvatar address={id} size={100} />
              </div>

              {/* Center: Text */}
              <div className="flex-1 pl-4">
                <div className="flex justify-between items-center ">
                  <h2 className="font-bold text-lg md:text-xl mb-1">{title}</h2>
                  <StatusBadge status={badgeText} />
                </div>

                <div className="flex justify-between items-center gap-2">
                  <p className="text-muted-foreground text-sm mb-2 max-w-[100%] md:max-w-[75%] w-full">
                    {truncatedDescription}
                  </p>

                  <div className="hidden md:flex flex-col items-center ">
                    <GradientText
                      colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                      animationSpeed={5}
                      showBorder={false}
                      className="text-4xl"
                    >
                      {price}
                    </GradientText>
                    <div className="flex gap-1">
                      <Image src="/eth.png" alt="Ethereum Logo" width={15} height={15} />
                      ETH
                    </div>
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex md:hidden mb-1">
                  <div className="flex items-center">
                    <GradientText
                      colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                      animationSpeed={5}
                      showBorder={false}
                      className="text-5xl"
                    >
                      {price}
                    </GradientText>
                    <Image src="/eth.png" alt="Ethereum Logo" width={35} height={35} className="ml-0" />
                  </div>
                </div>

                <div className="flex h-5 items-center space-x-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Contributor:</span>
                    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                      {contributors.map((addr, idx) => (
                        <BlockieAvatar key={idx} address={addr} size={20} />
                      ))}
                    </div>
                  </div>
                  <Separator orientation="vertical" />
                  <div className="flex items-center gap-2">
                    <CalendarDays size="20" />
                    {date}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </Link>
  );
};
