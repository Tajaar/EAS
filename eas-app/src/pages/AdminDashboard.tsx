// eas-app/src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContent";
import { getAllLogs, checkIn, checkOut } from "../services/attendanceService";
import { AttendanceTable } from "../components/AttendanceTable";
import { AddUserCard } from "../components/AddUserCard";
import { EmployeeList } from "../components/EmployeeList";
import { LogFilter } from "../components/LogFilter";
import { api } from "../services/api";
import { SummaryCard } from "../components/SummaryCard";
import { CheckToggle } from "../components/CheckToggle";
import { motion } from "framer-motion";
import styled from "styled-components";

const CardsRow = styled.div`
  display: flex;
  flex-wrap: wrap;           /* Wrap on smaller screens */
  justify-content: center;   /* Center row horizontally */
  gap: 32px;                 /* Spacing between cards */
  margin-bottom: 48px;
  width: 100%;
`;
interface Summary {
  first_in: string | null;
  final_out: string | null;
  total_duration: string | null;
}

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [summary, setSummary] = useState<Summary>({
    first_in: null,
    final_out: null,
    total_duration: null,
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all logs
  const fetchLogs = async () => {
    if (!user) return;
    try {
      const data = await getAllLogs(user.id);
      setLogs(data || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  // Fetch summary for selected employee or admin
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

  // Fetch current check-in status
  const fetchCheckStatus = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/attendance/check-status?user_id=${user.id}`);
      setIsCheckedIn(res.data.checked_in);
    } catch (err) {
      console.error("Error fetching check-in status:", err);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchLogs();
      await fetchSummary();
      await fetchCheckStatus();
    };
    initialize();
  }, []);

  if (!user) return <p className="text-center text-gray-400 mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <main className="max-w-7xl mx-auto py-8 px-4 flex flex-col gap-8">
  {/* Check-in/out Toggle */}
  <CheckToggle
    initialChecked={isCheckedIn}
    onChange={async (newState) => {
      setLoading(true);
      try {
        if (newState) await checkIn(user.id);
        else await checkOut(user.id);

        setIsCheckedIn(newState);
        await fetchLogs();
        await fetchSummary(selectedEmployeeId ?? undefined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }}
  />

  {/* Summary Card */}
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    <SummaryCard
      first_in={summary.first_in}
      final_out={summary.final_out}
      total_duration={summary.total_duration}
    />
  </motion.div>

    {/* Add User + Employee List */}
    <CardsRow>
      <AddUserCard />
      <EmployeeList
        onSelectEmployee={(id: number) => {
          setSelectedEmployeeId(id);
          fetchSummary(id);
        }}
      />
    </CardsRow>


  {/* Log Filter */}
  <motion.div
    className="bg-white rounded-xl shadow-md p-6"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <LogFilter onFilter={(filteredLogs: any[]) => setLogs(filteredLogs)} />
  </motion.div>

  {/* Attendance Table */}
  <motion.div
    className="bg-white rounded-xl shadow-md p-6"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <h3 className="text-lg font-semibold mb-4">
      All Employees Attendance Logs
    </h3>
    <AttendanceTable logs={logs} />
  </motion.div>
</main>

    </div>
  );
};
