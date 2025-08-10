import { NetworkOptions } from "./NetworkOptions";
import { useDisconnect } from "wagmi";
import { ArrowLeftOnRectangleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~~/components/ui/dropdown-menu";

export const WrongNetworkDropdown = () => {
  const { disconnect } = useDisconnect();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Wrong network</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <NetworkOptions />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div onClick={() => disconnect()}> Disconnect</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    // <div className="dropdown dropdown-end mr-2">
    //   <label tabIndex={0} className="btn btn-error btn-sm dropdown-toggle gap-1">
    //     <span>Wrong network</span>
    //     <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
    //   </label>
    //   <ul
    //     tabIndex={0}
    //     className="dropdown-content menu p-2 mt-1 shadow-center shadow-accent bg-base-200 rounded-box gap-1"
    //   >
    //     <NetworkOptions />
    //     <li>
    //       <button
    //         className="menu-item text-error btn-sm rounded-xl! flex gap-3 py-3"
    //         type="button"
    //         onClick={() => disconnect()}
    //       >
    //         <ArrowLeftOnRectangleIcon className="h-6 w-4 ml-2 sm:ml-0" />
    //         <span>Disconnect</span>
    //       </button>
    //     </li>
    //   </ul>
    // </div>
  );
};
