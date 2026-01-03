"use client";

import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createAlert } from "@/lib/actions/alert.action";
import { toast } from "sonner";

const AddAlertNotification = ({ selectedStock }: any) => {
  const { company, symbol, priceFormatted } = selectedStock;
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Values
    const name = formData.get("name") as string;
    // stock-identifier is disabled, so we use the prop
    const type = formData.get("alert-type") as string;
    const condition = formData.get("condition") as string;
    const thresholdStr = formData.get("threshold-value") as string;
    const frequency = formData.get("frequency") as string;

    // Simple validation
    if (!thresholdStr) {
      toast.error("Please enter a threshold value");
      return;
    }

    const threshold = parseFloat(thresholdStr);
    if (isNaN(threshold)) {
      toast.error("Threshold value must be a number");
      return;
    }

    startTransition(async () => {
      const result = await createAlert({
        name,
        symbol: symbol, // Ensure we use the symbol from props
        type,
        condition,
        threshold,
        frequency,
      });

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-gray-400 border-gray-600 hover:bg-gray-700 hover:text-white add-alert">Add Alert</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-400 border-gray-600">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Price Alert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1" className="text-gray-400">Alert Name</Label>
              <Input
                id="name-1"
                name="name"
                defaultValue={company}
                className="bg-gray-800 border-gray-600 text-white focus-visible:ring-0 focus-visible:border-yellow-500"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="stock-identifier" className="text-gray-400">Stock identifier</Label>
              <Input
                id="stock-identifier"
                name="stock-identifier"
                defaultValue={symbol}
                className="bg-gray-800 border-gray-600 text-white focus-visible:ring-0 focus-visible:border-yellow-500"
                disabled
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="alert-type" className="text-gray-400">Alert Type</Label>
              <Select name="alert-type" defaultValue="price">
                <SelectTrigger id="alert-type" className="w-full bg-gray-800 border-gray-600 text-white focus:ring-0 focus:border-yellow-500">
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-gray-400">
                  <SelectItem value="price" className="focus:bg-gray-700 focus:text-yellow-500">Price</SelectItem>
                  <SelectItem value="percent" className="focus:bg-gray-700 focus:text-yellow-500">Percentage Change</SelectItem>
                  <SelectItem value="volume" className="focus:bg-gray-700 focus:text-yellow-500">Volume</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="condition" className="text-gray-400">Condition</Label>
              <Select name="condition" defaultValue="above">
                <SelectTrigger id="condition" className="w-full bg-gray-800 border-gray-600 text-white focus:ring-0 focus:border-yellow-500">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-gray-400">
                  <SelectItem value="above" className="focus:bg-gray-700 focus:text-yellow-500">Greater than</SelectItem>
                  <SelectItem value="below" className="focus:bg-gray-700 focus:text-yellow-500">Less than</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="threshold-value" className="text-gray-400">Threshold value</Label>
              <Input
                id="threshold-value"
                name="threshold-value"
                type="number"
                step="any"
                placeholder={`eg: ${priceFormatted?.replace(/[^0-9.]/g, '') || "100"}`} // extracting number from formatted price for placeholder hint if possible
                className="bg-gray-800 border-gray-600 text-white focus-visible:ring-0 focus-visible:border-yellow-500"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="frequency" className="text-gray-400">Frequency</Label>
              <Select name="frequency" defaultValue="Once per day">
                <SelectTrigger id="frequency" className="w-full bg-gray-800 border-gray-600 text-white focus:ring-0 focus:border-yellow-500">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-gray-400">
                  <SelectItem value="Once per day" className="focus:bg-gray-700 focus:text-yellow-500">Once per day</SelectItem>
                  <SelectItem value="Once per hour" className="focus:bg-gray-700 focus:text-yellow-500">Once per hour</SelectItem>
                  <SelectItem value="Once per minute" className="focus:bg-gray-700 focus:text-yellow-500">Once per minute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="text-gray-400 border-gray-600 hover:bg-gray-700 hover:text-white hover:border-gray-500"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-yellow-500 text-gray-900 hover:bg-yellow-400 font-semibold"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Alert"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAlertNotification;
