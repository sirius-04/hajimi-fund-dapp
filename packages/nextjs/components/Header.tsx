"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SwitchTheme } from "./SwitchTheme";
import ProgramForm from "./ui/ProgramForm";
import ShinyText from "./ui/ShinyText";
import { Compass, Ticket } from "lucide-react";
import { hardhat } from "viem/chains";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~~/components/ui/dropdown-menu";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Discover",
    href: "/",
    icon: <Compass className="h-4 w-4" />,
  },
  {
    label: "Programs",
    href: "/userPrograms",
    icon: <Ticket className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = ({ onClick }: { onClick?: () => void }) => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <Link key={href} href={href} onClick={onClick}>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                isActive ? "bg-secondary" : "hover:bg-muted"
              }`}
            >
              {icon}
              <span>{label}</span>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <header className="fixed top-0 z-50 w-full bg-background border dark:border-b-neutral-800 border-b-neutral-200 p-3 md:px-6 md:py-3 flex items-center justify-between ">
      <div className="flex items-center gap-4 container ">
        {/* Mobile menu */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bars3Icon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 dark:bg-neutral-900">
              {menuLinks.map(({ label, href, icon }) => (
                <DropdownMenuItem asChild key={href}>
                  <Link href={href} className="flex items-center gap-2">
                    {icon}
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Logo + Brand */}
        <Link href="/" className=" flex items-center gap-2">
          <div className="relative w-11 h-11">
            <Image alt="Project logo" src="/favicon.png" fill className="object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-base">Hajimi Fund</span>
            <span className="text-xs text-muted-foreground">sholarship program</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-4">
          <HeaderMenuLinks />
        </nav>
      </div>

      {/* Right actions */}
      <div className="flex items-center justify-end gap-2 w-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="lg" className="cursor-pointer">
              <ShinyText>
                <h1 className="font-black">Create Program</h1>
              </ShinyText>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Program</DialogTitle>
              <DialogDescription>Enter your program details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <ProgramForm />
            </div>
          </DialogContent>
        </Dialog>

        <RainbowKitCustomConnectButton />
        <SwitchTheme />
        {/* {isLocalNetwork && <FaucetButton />} */}
      </div>
    </header>
  );
};
