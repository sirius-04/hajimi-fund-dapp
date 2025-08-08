import { useState } from "react";
import Link from "next/link";
import { NetworkOptions } from "./NetworkOptions";
import { ChevronDown, User } from "lucide-react";
import toast from "react-hot-toast";
import { getAddress } from "viem";
import { Address } from "viem";
import { useAccount, useDisconnect } from "wagmi";
import {
  ArrowLeftOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { BlockieAvatar, isENS } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~~/components/ui/dropdown-menu";
import { HoverBorderGradient } from "~~/components/ui/hover-border-gradient";
import { useCopyToClipboard } from "~~/hooks/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const BURNER_WALLET_ID = "burnerWallet";
const allowedNetworks = getTargetNetworks();

type AddressInfoDropdownProps = {
  address: Address;
  blockExplorerAddressLink: string | undefined;
  displayName: string;
  ensAvatar?: string;
  onQrClick: () => void;
};

export const AddressInfoDropdown = ({
  address,
  ensAvatar,
  displayName,
  blockExplorerAddressLink,
  onQrClick,
}: AddressInfoDropdownProps) => {
  const { disconnect } = useDisconnect();
  const { connector } = useAccount();
  const checkSumAddress = getAddress(address);
  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const { copyToClipboard: copyAddressToClipboard, isCopiedToClipboard: isAddressCopiedToClipboard } =
    useCopyToClipboard();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm shadow-sm transition hover:bg-muted">
          <BlockieAvatar address={checkSumAddress} size={30} ensImage={ensAvatar} />
          <span className="ml-2">
            {isENS(displayName) ? displayName : `${checkSumAddress?.slice(0, 6)}...${checkSumAddress?.slice(-4)}`}
          </span>
          <ChevronDownIcon className="h-4 w-4 ml-1" />
        </button> */}

        {/* <Button>
          <BlockieAvatar address={checkSumAddress} size={30} ensImage={ensAvatar} />
          <span className="ml-2">
            {isENS(displayName) ? displayName : `${checkSumAddress?.slice(0, 6)}...${checkSumAddress?.slice(-4)}`}
          </span>
          <ChevronDownIcon />
        </Button> */}
        <HoverBorderGradient
          containerClassName="rounded-md"
          as="button"
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 cursor-pointer text-sm px-3 py-1.5"
        >
          <BlockieAvatar address={checkSumAddress} size={30} ensImage={ensAvatar} />
          <span className="ml-2">
            {isENS(displayName) ? displayName : `${checkSumAddress?.slice(0, 6)}...${checkSumAddress?.slice(-4)}`}
          </span>
          <ChevronDownIcon className="h-4 w-4 ml-1" />
        </HoverBorderGradient>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 mt-2 p-2  rounded-md bg-popover text-popover-foreground dark:bg-neutral-900 shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.1)] ">
        {selectingNetwork ? (
          <NetworkOptions hidden={false} />
        ) : (
          <>
            {/* User */}
            <Link href="/profile/[...address]" as={`/profile/${checkSumAddress}`} passHref>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
            </Link>

            {/* Copy Address */}
            <DropdownMenuItem
              onClick={() => {
                copyAddressToClipboard(checkSumAddress);
                toast.success("Copied successfully!");
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
              Copy address
            </DropdownMenuItem>

            {/* View QR Code */}
            <DropdownMenuItem
              onSelect={(e: any) => {
                e.preventDefault();
                onQrClick(); // 🔥 trigger modal from parent
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <QrCodeIcon className="h-4 w-4" />
              View QR Code
            </DropdownMenuItem>

            {/* View on Block Explorer */}
            {blockExplorerAddressLink && (
              <DropdownMenuItem asChild>
                <a
                  href={blockExplorerAddressLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  View on Block Explorer
                </a>
              </DropdownMenuItem>
            )}

            {/* Switch Network */}
            {allowedNetworks.length > 1 && (
              <DropdownMenuItem
                onClick={() => setSelectingNetwork(true)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ArrowsRightLeftIcon className="h-4 w-4" />
                Switch Network
              </DropdownMenuItem>
            )}

            {/* Reveal Private Key */}
            {connector?.id === BURNER_WALLET_ID && (
              <DropdownMenuItem asChild>
                <label
                  htmlFor="reveal-burner-pk-modal"
                  className="flex items-center gap-2 text-destructive cursor-pointer"
                >
                  <EyeIcon className="h-4 w-4" />
                  Reveal Private Key
                </label>
              </DropdownMenuItem>
            )}

            {/* <DropdownMenuSeparator /> */}

            {/* Disconnect */}
            <DropdownMenuItem
              onClick={() => disconnect()}
              className="flex items-center gap-2 text-destructive dark:text-red-500 cursor-pointer"
            >
              <ArrowLeftOnRectangleIcon className="h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
