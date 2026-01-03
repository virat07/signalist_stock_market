"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WATCHLIST_TABLE_HEADER } from "@/lib/constants";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { cn, getChangeColorClass } from "@/lib/utils";
import WatchlistButton from "./WatchlistButton";
import AddAlertNotification from "./AddAlertNotification";

export function WatchlistTable({ watchlist }: WatchlistTableProps) {
  const router = useRouter();

  return (
    <>
      <Table className="scrollbar-hide-default watchlist-table">
        <TableHeader>
          <TableRow className="table-header-row">
            {WATCHLIST_TABLE_HEADER.map((label) => (
              <TableHead className="table-header" key={label}>
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchlist.map((item, index) => (
            <TableRow key={item.symbol + index} className="table-row">
              <TableCell>
                <WatchlistButton
                  symbol={item.symbol}
                  company={item.company}
                  isInWatchlist={true}
                  showTrashIcon={true}
                  type="icon"
                />
              </TableCell>
              <TableCell
                className="pl-4 table-cell"
                onClick={() =>
                  router.push(`/stocks/${encodeURIComponent(item.symbol)}`)
                }
              >
                {item.company}
              </TableCell>
              <TableCell className="table-cell">{item.symbol}</TableCell>
              <TableCell className="table-cell">
                {item.priceFormatted || "—"}
              </TableCell>
              <TableCell
                className={cn(
                  "table-cell",
                  getChangeColorClass(item.changePercent)
                )}
              >
                {item.changeFormatted || "—"}
              </TableCell>
              <TableCell className="table-cell">
                {item.marketCap || "—"}
              </TableCell>
              <TableCell className="table-cell">
                {item.peRatio || "—"}
              </TableCell>
              <TableCell>
                <AddAlertNotification selectedStock={item} />
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
