import React from "react";

/** utility to format duration seconds -> HH:MM:SS */
const fmtDuration = (secs: number) => {
  if (!secs || secs <= 0) return "00:00:00";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [h, m, s].map(n => String(n).padStart(2, "0")).join(":");
};

export const SummaryCard: React.FC<{
  firstIn?: string | null; // ISO string
  lastOut?: string | null; // ISO string
  totalSeconds?: number;
}> = ({ firstIn, lastOut, totalSeconds = 0 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-4 w-full sm:w-96">
      <h3 className="text-lg font-semibold">Today's summary</h3>
      <div className="mt-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">First in</span>
          <span className="font-medium">{firstIn ? new Date(firstIn).toLocaleTimeString() : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Last out</span>
          <span className="font-medium">{lastOut ? new Date(lastOut).toLocaleTimeString() : "—"}</span>
        </div>
        <div className="flex justify-between pt-2 border-t pt-3">
          <span className="text-sm text-gray-600">Total time</span>
          <span className="font-semibold">{fmtDuration(totalSeconds)}</span>
        </div>
      </div>
    </div>
  );
};
