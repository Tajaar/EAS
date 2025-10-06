// eas-app/src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContent";
import { getAllLogs } from "../services/attendanceService";
import { AttendanceTable } from "../components/AttendanceTable";
import { CheckInOutButton } from "../components/CheckInOutButton";
import { AddUserForm } from "../components/AddUserForm";
import { EmployeeList } from "../components/EmployeeList";
import { LogFilter } from "../components/LogFilter";
import { api } from "../services/api";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    first_in: null,
    final_out: null,
    total_duration: null,
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  // Fetch all logs
  const fetchLogs = async () => {
    if (user) {
      const data = await getAllLogs(user.id);
      setLogs(data);
    }
  };

  // Fetch summary for selected employee or admin themselves
  const fetchSummary = async (employeeId?: number) => {
    if (!user) return;
    try {
      const id = employeeId || user.id;
      const res = await api.get(
        `/attendance/today-summary?current_user_id=${user.id}&user_id=${id}`
      );
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  // Fetch initial logs and summary
  useEffect(() => {
    fetchLogs();
    fetchSummary();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Admin Dashboard - {user.name}</h2>

      {/* Check-in / Check-out button */}
      <CheckInOutButton
        userId={user.id}
        onUpdate={() => {
          fetchLogs();                       // refresh all logs
          fetchSummary(selectedEmployeeId ?? undefined);   // refresh summary for selected employee
        }}
      />

      {/* Add user form */}
      <AddUserForm />

      {/* Employee list with selection */}
      <EmployeeList
        onSelectEmployee={(id: number) => {
          setSelectedEmployeeId(id);
          fetchSummary(id);
        }}
      />

      {/* Summary for selected employee */}
      <div className="bg-gray-100 p-4 rounded shadow-md my-4">
        <h3 className="text-lg mb-2">
          {selectedEmployeeId ? "Selected Employee" : "Your"} Attendance Summary
        </h3>
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

      {/* Log filter */}
      <LogFilter onFilter={(filteredLogs: any[]) => setLogs(filteredLogs)} />

      {/* Attendance logs table */}
      <h3 className="text-lg mt-4 mb-2">All Employees Attendance Logs</h3>
      <AttendanceTable logs={logs} />
    </div>
  );
};
