// eas-app/src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContent";
import { getAllLogs, checkIn, checkOut } from "../services/attendanceService";
import { AttendanceTable } from "../components/AttendanceTable";
import { AddUserCard } from "../components/AddUserCard";
import { EmployeeList } from "../components/EmployeeList";
import { LogFilter } from "../components/LogFilter";
import { api } from "../services/api";
import { Users, Filter, PlusCircle } from "lucide-react";
import { SummaryCard } from "../components/SummaryCard";
import { CheckToggle } from "../components/CheckToggle";
import Button from '../components/Button';
import { motion, AnimatePresence } from "framer-motion";


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
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
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
      const res = await api.get(`/attendance/today-summary?current_user_id=${user.id}&user_id=${id}`);
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
      <main className="max-w-7xl mx-auto py-8 px-4">

        {/* Check-in/out Toggle */}
        <div className="mb-8">
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
        </div>

        {/* Summary Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <SummaryCard
            first_in={summary.first_in}
            final_out={summary.final_out}
            total_duration={summary.total_duration}
          />
        </motion.div>

        {/* Add User */}
        <motion.div className="mb-6">
          <AnimatePresence initial={false}>
            {showAddUser && (
              <motion.div
                key="add-user-card"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-4"
              >
                <AddUserCard apiBase="/api" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Employee List */}
        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button onClick={() => setShowEmployeeList(!showEmployeeList)}>
            <Users className="w-5 h-5" />
            {showEmployeeList ? "Hide Employee List" : "View Employee List"}
          </Button>
          {showEmployeeList && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="overflow-hidden mt-4">
              <EmployeeList
                onSelectEmployee={(id: number) => {
                  setSelectedEmployeeId(id);
                  fetchSummary(id);
                }}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Log Filter */}
        <motion.div className="bg-white rounded-xl shadow-md p-6 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-blue-500 w-5 h-5" />
            <h3 className="text-lg font-semibold">Filter Logs</h3>
          </div>
          <LogFilter onFilter={(filteredLogs: any[]) => setLogs(filteredLogs)} />
        </motion.div>

        {/* Attendance Table */}
        <motion.div className="bg-white rounded-xl shadow-md p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-lg font-semibold mb-4">All Employees Attendance Logs</h3>
          <AttendanceTable logs={logs} />
        </motion.div>
      </main>
    </div>
  );
};
