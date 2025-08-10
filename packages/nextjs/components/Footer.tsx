import React from "react";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { BuidlGuidlLogo } from "~~/components/assets/BuidlGuidlLogo";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <footer className="relative w-full z-20 text-muted-foreground text-sm py-4 px-6 flex flex-col items-center justify-center">
      {/* Gradient Top Border */}
      <div
        className="absolute top-0 left-0 w-full h-[1px] pointer-events-none z-[-1]"
        style={{
          background: "linear-gradient(to right, transparent 20%, #888 30%, transparent 90%)",
        }}
      />

      <span className="text-center">© {new Date().getFullYear()} Hajimi Fund dapp all right reserved.</span>

      <div className="flex items-center gap-2 mt-1">
        <Link href="/" className="hover:underline">
          About
        </Link>
        <Link href="/" className="hover:underline">
          Contact
        </Link>
        <Link href="/" className="hover:underline">
          Privacy
        </Link>
      </div>
    </footer>
  );
};
