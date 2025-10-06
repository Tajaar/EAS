import { useState } from "react";
import { checkIn, checkOut } from "../services/attendanceService";

interface Props {
  userId: number;
  onUpdate?: () => void; // optional callback to refresh logs/summary
}

export const CheckInOutButton = ({ userId, onUpdate }: Props) => {
  const [message, setMessage] = useState("");

  const handleCheckIn = async () => {
    try {
      const res = await checkIn(userId);
      setMessage(res.data.message);
      if (onUpdate) onUpdate(); // refresh dashboard after check-in
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Error during check-in");
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await checkOut(userId);
      setMessage(res.data.message);
      if (onUpdate) onUpdate(); // refresh dashboard after check-out
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Error during check-out");
    }
  };

  return (
    <div className="my-4">
      <button
        onClick={handleCheckIn}
        className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
      >
        Check In
      </button>
      <button
        onClick={handleCheckOut}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Check Out
      </button>
      {message && <p className="mt-2 text-blue-700">{message}</p>}
    </div>
  );
};
