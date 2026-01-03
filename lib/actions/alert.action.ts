"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Alert } from "@/database/models/alert.model";
import { headers } from "next/headers";
import { auth } from "../better-auth/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getStocksDetails } from "./finnhub.actions";

export const getUserAlerts = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect("/sign-in");

    await connectToDatabase();

    const alerts = await Alert.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const alertsWithData = await Promise.all(
      alerts.map(async (alert) => {
        try {
          const stockData = await getStocksDetails(alert.symbol);
          return {
            ...alert,
            currentPrice: stockData?.currentPrice,
            priceFormatted: stockData?.priceFormatted,
            changePercent: stockData?.changePercent,
            changeFormatted: stockData?.changeFormatted,
            logo: stockData?.logo,
            companyName: stockData?.company || alert.name,
          };
        } catch (e) {
            console.error(`Failed to fetch stock data for alert ${alert.symbol}`, e);
            return {
                ...alert,
                currentPrice: 0,
                priceFormatted: "N/A",
                changePercent: 0,
                changeFormatted: "N/A",
                logo: "",
                companyName: alert.name
            };
        }
      })
    );

    return JSON.parse(JSON.stringify(alertsWithData));
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw new Error("Failed to fetch alerts");
  }
};

interface CreateAlertParams {
  name: string;
  symbol: string;
  type: string;
  condition: string;
  threshold: number;
  frequency: string;
}

export const createAlert = async (params: CreateAlertParams) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect("/sign-in");

    const { name, symbol, type, condition, threshold, frequency } = params;

    if (!symbol || !type || !condition || threshold === undefined) {
      return { success: false, error: "Missing required fields" };
    }

    await connectToDatabase();

    const newAlert = new Alert({
      userId: session.user.id,
      name,
      symbol: symbol.toUpperCase(),
      type,
      condition,
      threshold,
      frequency: frequency || "Once per day",
    });

    await newAlert.save();

    revalidatePath("/watchlist"); // or wherever the alerts are shown
    return { success: true, message: "Alert created successfully" };
  } catch (error) {
    console.error("Error creating alert:", error);
    return { success: false, error: "Failed to create alert" };
  }
};

export const deleteAlert = async (alertId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect("/sign-in");

    await connectToDatabase();

    const result = await Alert.deleteOne({
      _id: alertId,
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return { success: false, error: "Alert not found or unauthorized" };
    }

    revalidatePath("/watchlist"); 
    return { success: true, message: "Alert removed successfully" };
  } catch (error) {
    console.error("Error removing alert:", error);
    return { success: false, error: "Failed to remove alert" };
  }
};
