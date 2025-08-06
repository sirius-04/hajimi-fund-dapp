"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GradientText from "./ui/GradientText";
import { Badge } from "./ui/badge";
import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { GlowingEffect } from "~~/components/ui/glowing-effect";

export function ProgramCard() {
  return (
    <ul className="flex flex-col gap-3">
      <GridItem
        icon={<Box className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Do things the right way"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      />
      <GridItem
        icon={<Settings className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="The best AI code editor ever."
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      />
      <GridItem
        icon={<Lock className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="You should buy Aceternity UI Pro"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      />
      <GridItem
        icon={<Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="This card is also built by Cursor"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      />
      <GridItem
        icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Coming soon on Aceternity UI"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      />
      <GridItem
        icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Coming soon on Aceternity UI"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      />
      <GridItem
        icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Coming soon on Aceternity UI"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      />
      <GridItem
        icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Coming soon on Aceternity UI"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      />
    </ul>
  );
}

interface GridItemProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ icon, title, description }: GridItemProps) => {
  const [maxDescLength, setMaxDescLength] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      setMaxDescLength(window.innerWidth < 768 ? 100 : 300); // mobile & desktop
    };

    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure description is a string and truncate if needed
  const finalDescription = typeof description === "string" ? description : "";
  const truncatedDescription =
    finalDescription.length > maxDescLength ? `${finalDescription.slice(0, maxDescLength)}...` : finalDescription;

  return (
    <Link href="/program">
      <li className="list-none">
        <div className="relative h-full rounded-xl border p-2 md:rounded-3xl md:p-3 dark:bg-neutral-900 dark:hover:bg-[#1d1d1f] hover:bg-neutral-100 cursor-pointer">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
          <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-2 md:p-2 ]">
            {/* Contain start here */}
            <div className="flex items-center justify-between w-full">
              {/* Left: Image */}
              <div className="min-w-24 min-h-24 w-24 h-24">
                <BlockieAvatar address="0x34aA3F359A9D614239015126635CE7732c18fDF3" size={100} />
              </div>

              {/* Center: Text */}
              <div className="flex-1 pl-4">
                <div className="flex justify-between  items-center ">
                  <h2 className="font-bold text-lg md:text-xl mb-1">{title}</h2>
                  <Badge className="h-6 bg-violet-500 text-white ">In progress</Badge>
                </div>

                <div className="flex justify-between items-center gap-2">
                  <p className="text-muted-foreground text-sm mb-2 max-w-[100%] md:max-w-[80%] w-full">
                    {truncatedDescription}
                  </p>

                  <div className="hidden md:flex items-center gap-1">
                    <GradientText
                      colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                      animationSpeed={5}
                      showBorder={false}
                      className="text-5xl"
                    >
                      1.00
                    </GradientText>
                    <Image src="/eth.png" alt="Ethereum Logo" width={35} height={35} />
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
                      1.00
                    </GradientText>
                    <Image src="/eth.png" alt="Ethereum Logo" width={35} height={35} className="ml-0" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Contributor:</span>
                  <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                    <BlockieAvatar address="0xfc9400703dA075a14C9Cc4b87726FA90aDc055F2" size={20} />
                    <BlockieAvatar address="0x2f2F5CC5267BA8A9f6E7D6281DD436ABA6125aE5" size={20} />
                    <BlockieAvatar address="0xD1080dD3eb453F88988b88a15b3C5c6b72D7f340" size={20} />
                    <BlockieAvatar address="0x9d67818bE11a5377907103Eb1f6BA75055cE6280" size={20} />
                    <BlockieAvatar address="0xB7931A7947107a53f48F086D39920Cd9Cee7BA31" size={20} />
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
