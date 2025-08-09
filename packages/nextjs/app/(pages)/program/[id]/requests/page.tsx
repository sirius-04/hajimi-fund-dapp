"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft } from "lucide-react";
import RequestForm from "~~/components/ui/RequestForm";
import { BackgroundBeams } from "~~/components/ui/background-beams";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~~/components/ui/dialog";
import { Progress } from "~~/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/table";

const data: Request[] = [
  {
    id: "1",
    amount: 316,
    status: "success",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, sint",
    date: "2023-10-01",
  },
  {
    id: "2",
    amount: 242,
    status: "success",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, sint",
    date: "2023-10-01",
  },
  {
    id: "3",
    amount: 837,
    status: "processing",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, sint",
    date: "2023-10-01",
  },
  {
    id: "4",
    amount: 874,
    status: "success",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, sint",
    date: "2023-10-01",
  },
  {
    id: "5",
    amount: 721,
    status: "rejected",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, sint",
    date: "2023-10-01",
  },
  {
    id: "6",
    amount: 721,
    status: "rejected",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, sint",
    date: "2023-10-01",
  },
  {
    id: "7",
    amount: 721,
    status: "rejected",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, sint",
    date: "2023-10-01",
  },
  {
    id: "8",
    amount: 721,
    status: "rejected",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, sint",
    date: "2023-10-01",
  },
  {
    id: "9",
    amount: 721,
    status: "rejected",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, sint",
    date: "2023-10-01",
  },
  {
    id: "10",
    amount: 721,
    status: "rejected",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, sint",
    date: "2023-10-01",
  },
];

interface Request {
  id: string;
  amount: number;
  status: "processing" | "success" | "rejected";
  title: string;
  date: string;
}

function ApprovalsCell() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return <Progress value={progress} className="w-30 mx-auto" />;
}

const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "id",
    header: () => {
      return <Button variant="ghost">Id</Button>;
    },
    cell: ({ row }) => <div className="lowercase p-2 mx-auto ml-2">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: () => {
      return <Button variant="ghost">Title</Button>;
    },
    cell: ({ row }) => (
      <Link href="/requests" className="cursor-pointer hover:underline lowercase">
        {row.getValue("title")}
      </Link>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    id: "approvals",
    header: () => <div className="text-center">Approvals</div>,
    cell: () => {
      return (
        <div className="flex items-center justify-center">
          <ApprovalsCell />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center w-20">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const bgColor = status === "processing" ? "bg-amber-600" : status === "success" ? "bg-green-600" : "bg-red-500";
      return <Badge className={`capitalize ${bgColor} dark:text-white w-20 text-center`}>{status}</Badge>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
];
const Page = () => {
  const params = useParams();
  const programId = params.id as string;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });
  return (
    <div className="w-full h-full py-20 px-10 mt-5">
      <BackgroundBeams />
      <div className="flex items-center justify-between py-4">
        <Link href={`/program/${programId}`} className="z-10 ">
          <button className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 cursor-pointer">
            <ArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
          </button>
        </Link>
        {/* <Button variant="outline" className="cursor-pointer">
          Create Requests
        </Button> */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="cursor-pointer z-10">
              Create Requests
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create a New Request</DialogTitle>
            </DialogHeader>
            <RequestForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="dark:bg-gray-800">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="text-white">
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
