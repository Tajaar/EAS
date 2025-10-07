import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContent";
import { getLogs, checkIn, checkOut } from "../services/attendanceService";
import { api } from "../services/api";
import { CalendarDays } from "lucide-react";
import { AttendanceTable } from "../components/AttendanceTable";
import { motion } from "framer-motion";
import { CheckToggle } from "../components/CheckToggle";
import { SummaryCard } from "../components/SummaryCard";
import { EmployeeTable } from "../components/EmployeeTable";

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    first_in: null,
    final_out: null,
    total_duration: null,
  });
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);

  // Fetch all logs
  const fetchLogs = async () => {
    if (!user) return;
    const data = await getLogs(user.id);
    setLogs(data || []);
    setFilteredLogs(data || []);
  };

  // Fetch summary
  const fetchSummary = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/attendance/today-summary?current_user_id=${user.id}`);
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  // Fetch check-in status
  const fetchCheckStatus = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/attendance/check-status?user_id=${user.id}`);
      setIsCheckedIn(res.data.checked_in);
    } catch (err) {
      console.error("Error fetching check-in status:", err);
    }
  };

  const handleToggle = async (newState: boolean) => {
    if (!user) return;
    setLoading(true);
    try {
      if (newState) {
        await checkIn(user.id);
      } else {
        await checkOut(user.id);
      }
      setIsCheckedIn(newState);
      await fetchLogs();
      await fetchSummary();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchLogs();
    fetchCheckStatus();
  }, [user]);

  if (!user) return <p className="text-center text-gray-400 mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <main className="max-w-7xl mx-auto py-8 px-4 flex flex-col gap-8">
        {/* Check-In / Check-Out */}
        <CheckToggle initialChecked={isCheckedIn} onChange={handleToggle} />

        {/* Summary Card */}
        <SummaryCard
          first_in={summary.first_in}
          final_out={summary.final_out}
          total_duration={summary.total_duration}
        />

        {/* Log Filter */}
        <EmployeeTable
            logs={logs}
            onFilter={(dayLogs) => setFilteredLogs(dayLogs.length ? dayLogs : logs)}
          />  
        {/* Attendance Logs */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="text-blue-500 w-5 h-5" />
            <h3 className="text-lg font-semibold">Attendance Logs</h3>
          </div>
          {filteredLogs.length > 0 ? (
            <AttendanceTable logs={filteredLogs} />
          ) : (
            <p className="text-gray-500 text-center py-4">
              No attendance logs found. Use the search above.
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
};
