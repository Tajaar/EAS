import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContent";
import { api } from "../services/api";

interface Summary {
  first_in: string | null;
  final_out: string | null;
  total_duration: string | null;
}

export const TodaySummary = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Summary>({
    first_in: null,
    final_out: null,
    total_duration: null,
  });

  const fetchSummary = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/attendance/today-summary/${user.id}`);
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary", err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
      <h3 className="text-lg mb-2">Today's Attendance Summary</h3>
      <p>
        <strong>First In:</strong>{" "}
        {summary.first_in ? new Date(summary.first_in).toLocaleTimeString() : "-"}
      </p>
      <p>
        <strong>Final Out:</strong>{" "}
        {summary.final_out ? new Date(summary.final_out).toLocaleTimeString() : "-"}
      </p>
      <p>
        <strong>Total Duration:</strong> {summary.total_duration || "-"}
      </p>
    </div>
  );
};
