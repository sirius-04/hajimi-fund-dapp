"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
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
import { formatEther } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import StatusBadge from "~~/components/StatusBadge";
import RequestForm from "~~/components/ui/RequestForm";
import { BackgroundBeams } from "~~/components/ui/background-beams";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~~/components/ui/dialog";
import { Progress } from "~~/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/table";
import programAbi from "~~/contracts/ScholarshipProgram.json";
import getStatusText from "~~/func/getStatusText";

function RequestDetailsClient({ address }: { address: `0x${string}` }) {
  const account = useAccount();
  const { data } = useReadContracts({
    contracts: [
      {
        abi: programAbi,
        address: address,
        functionName: "getAllRequests",
      },
    ],
  });

  //   console.log(data);

  let id = 0;
  let title = "";
  let amount = 0n;
  let approvals = 0;
  let status = 0;
  let createdAt = 0;

  if (data && data[0]?.result) {
    [id, title, amount, approvals, status, createdAt] = data[0].result as [
      number,
      string,
      bigint,
      number,
      number,
      number,
    ];
  }

  const requestData = React.useMemo(() => {
    if (data && Array.isArray(data[0]?.result)) {
      return data[0].result.map((req: any) => ({
        id: Number(req.id),
        title: req.title,
        description: req.description,
        amount: Number(formatEther(req.value)),
        approvalCount: Number(req.approvalCount),
        status: req.status,
        createdAt: new Date(Number(req.createdAt) * 1000).toLocaleDateString(),
      }));
    }
    return [];
  }, [data]);

  const columns = [
    {
      accessorKey: "id",
      header: () => {
        return <Button variant="ghost">Id</Button>;
      },
      cell: ({ row }: any) => <div className="lowercase p-2 mx-auto ml-2">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "title",
      header: () => {
        return <Button variant="ghost">Title</Button>;
      },
      cell: ({ row }: any) => (
        <Link
          href={`/program/${address}/requests/${row.getValue("id")}`}
          className="cursor-pointer hover:underline lowercase"
        >
          {row.getValue("title")}
        </Link>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-center">Amount</div>,
      cell: ({ row }: any) => <div className="text-center font-medium">{row.getValue("amount")}</div>,
    },
    {
      id: "approvals",
      header: () => <div className="text-center">Approvals</div>,
      cell: ({ row }: any) => (
        <div className="flex items-center justify-center">
          <Progress value={row.getValue("approvals")} className="w-30 mx-auto" />
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="w-20">Status</div>,
      cell: ({ row }: any) => (
        // <Badge className="capitalize dark:text-white w-20 text-center">{row.getValue("status")}</Badge>
        <StatusBadge status={getStatusText("program", Number(row.getValue("status")))} />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }: any) => <div>{row.getValue("createdAt")}</div>,
    },
  ];

  const params = useParams();
  const programId = params.id as string;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data: requestData,
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
            {account.address ? (
              <RequestForm address={account.address as `0x${string}`} />
            ) : (
              <div className="text-red-500">No account address found.</div>
            )}
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
}

export default RequestDetailsClient;
