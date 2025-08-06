import { QRCodeSVG } from "qrcode.react";
import { Address as AddressType } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~~/components/ui/dialog";

type AddressQRCodeModalProps = {
  address: AddressType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddressQRCodeModal = ({ address, open, onOpenChange }: AddressQRCodeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Optional: You can expose <DialogTrigger> somewhere else if needed */}
      <DialogContent className="max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Wallet QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <QRCodeSVG value={address} size={256} />
          <Address address={address} format="long" disableAddressLink onlyEnsOrAddress />
        </div>
      </DialogContent>
    </Dialog>
  );
};
