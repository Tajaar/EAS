import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContent";
import { getLogs } from "../services/attendanceService";
import { AttendanceTable } from "../components/AttendanceTable";
import { CheckInOutButton } from "../components/CheckInOutButton";
import { api } from "../services/api";

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    first_in: null,
    final_out: null,
    total_duration: null,
  });

  // Fetch attendance logs
  const fetchLogs = async () => {
    if (user) {
      const data = await getLogs(user.id);
      setLogs(data);
    }
  };

  // Fetch today's summary
  const fetchSummary = async () => {
    if (!user) return;
    try {
      const res = await api.get(
        `/attendance/today-summary?current_user_id=${user.id}`
      );
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [user]);

  // Fetch logs on mount
  useEffect(() => {
    fetchLogs();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Welcome, {user.name}</h2>

      {/* Check-in / Check-out button */}
      <CheckInOutButton
        userId={user.id}
        onUpdate={() => {
            fetchLogs();      // refresh attendance logs
            fetchSummary();   // refresh today’s summary
        }}
        />

      {/* Today's summary */}
      <div className="bg-gray-100 p-4 rounded shadow-md my-4">
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

      {/* Attendance logs table */}
      <h3 className="text-lg mt-4 mb-2">Attendance Logs</h3>
      <AttendanceTable logs={logs} />
    </div>
  );
};
