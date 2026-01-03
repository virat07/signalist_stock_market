"use client";

import React, { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { deleteAlert } from "@/lib/actions/alert.action";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface AlertItemProps {
  alert: {
    _id: string;
    symbol: string;
    name: string;
    companyName?: string;
    logo?: string;
    type: "price" | "percent" | "volume";
    condition: "above" | "below";
    threshold: number;
    frequency: string;
    currentPrice?: number;
    priceFormatted?: string;
    changeFormatted?: string;
    changePercent?: number;
  };
}

const AlertItem = ({ alert }: AlertItemProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAlert(alert._id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  const isPositive = (alert.changePercent || 0) >= 0;
  const company = alert.companyName || alert.name;

  const formatThreshold = () => {
    if (alert.type === "price") return formatPrice(alert.threshold);
    if (alert.type === "percent") return `${alert.threshold}%`;
    return alert.threshold.toLocaleString();
  };

  const getConditionSign = () => {
    if (alert.condition === "above") return ">";
    if (alert.condition === "below") return "<";
    return "";
  };

  const getAlertLabel = () => {
    if (alert.type === "price") return "Price";
    if (alert.type === "percent") return "Change";
    if (alert.type === "volume") return "Volume";
    return "Value";
  };

  return (
    <div className="w-full bg-[#1A1E23] rounded-xl border border-gray-800 p-4 mb-4 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 rounded-lg bg-gray-800">
            <AvatarImage src={alert.logo} alt={company} />
            <AvatarFallback className="rounded-lg bg-gray-700 text-gray-400 font-bold">
              {alert.symbol.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-gray-300 font-medium text-sm leading-tight">
              {company}
            </h3>
            <span className="text-white font-bold text-lg mt-0.5">
              {alert.priceFormatted || "—"}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-500 font-medium text-sm">{alert.symbol}</span>
          <span
            className={`text-sm font-medium mt-0.5 ${isPositive ? "text-[#01C38D]" : "text-red-500"
              }`}
          >
            {alert.changeFormatted || "0.00%"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-800 mb-4" />

      {/* Footer */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-xs">Alert:</span>
          <span className="text-white font-bold text-base">
            {getAlertLabel()} {getConditionSign()} {formatThreshold()}
          </span>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white hover:bg-transparent"
              disabled // Placeholder for edit
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isPending}
              className="h-6 w-6 text-gray-400 hover:text-red-400 hover:bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <span className="bg-[#3E3826] text-[#F4D06F] text-[10px] font-medium px-2 py-1 rounded-md">
            {alert.frequency || "Once per day"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlertItem;
