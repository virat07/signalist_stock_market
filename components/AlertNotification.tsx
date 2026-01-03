import React from "react";
import { getUserAlerts } from "@/lib/actions/alert.action";
import AlertItem from "./AlertItem";
import { BellRing } from "lucide-react";

const AlertNotification = async () => {
  const alerts = await getUserAlerts();

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 h-full">
      <div className="space-y-1 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {alerts.length > 0 ? (
          alerts.map((alert: any) => (
            <AlertItem key={alert._id} alert={alert} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No alerts set</p>
            <p className="text-xs mt-1">Add an alert from your watchlist</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertNotification;
