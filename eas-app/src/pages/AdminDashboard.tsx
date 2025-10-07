// eas-app/src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContent";
import { getAllLogs, checkIn, checkOut } from "../services/attendanceService";
import { AttendanceTable } from "../components/AttendanceTable";
import { AddUserCard } from "../components/AddUserCard";
import { EmployeeList } from "../components/EmployeeList";
import { LogFilter } from "../components/LogFilter";
import { api } from "../services/api";
import { motion } from "framer-motion";
import { UserCog, LogOut, Users, Clock, Filter, PlusCircle } from "lucide-react";
import { CheckToggle } from "../components/CheckToggle";

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [summary, setSummary] = useState({
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

  // Initialize dashboard
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
      {/* Header */}
      <header className="flex items-center justify-between bg-black text-white px-6 py-4 shadow">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <UserCog className="w-6 h-6 text-blue-400" /> Admin Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">{user.name}</span>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Check-in/out Toggle */}
        <div className="mb-8">
          <CheckToggle
            initialChecked={isCheckedIn}
            onChange={async (newState) => {
              setLoading(true);
              try {
                if (newState) {
                  await checkIn(user.id);
                } else {
                  await checkOut(user.id);
                }
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

        {/* Today's Summary */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-blue-500 w-5 h-5" />
            <h3 className="text-lg font-semibold">
              {selectedEmployeeId ? "Selected Employee" : "Your"} Attendance Summary
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-gray-500">First In</p>
              <p className="font-medium">
                {summary.first_in ? new Date(summary.first_in).toLocaleTimeString() : "-"}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-gray-500">Last Out</p>
              <p className="font-medium">
                {summary.final_out ? new Date(summary.final_out).toLocaleTimeString() : "-"}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-gray-500">Total Duration</p>
              <p className="font-medium">{summary.total_duration || "-"}</p>
            </div>
          </div>
        </motion.div>

        {/* Collapsible Add User */}
        <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
          >
            <PlusCircle className="w-5 h-5" />
            {showAddUser ? "Hide Add User" : "Add New User"}
          </button>
          {showAddUser && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="overflow-hidden mt-4">
              <AddUserCard />
            </motion.div>
          )}
        </motion.div>

        {/* Collapsible Employee List */}
        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={() => setShowEmployeeList(!showEmployeeList)}
            className="flex items-center gap-2 text-white bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            <Users className="w-5 h-5" />
            {showEmployeeList ? "Hide Employee List" : "View Employee List"}
          </button>
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
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-blue-500 w-5 h-5" />
            <h3 className="text-lg font-semibold">Filter Logs</h3>
          </div>
          <LogFilter onFilter={(filteredLogs: any[]) => setLogs(filteredLogs)} />
        </motion.div>

        {/* Attendance Table */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold mb-4">All Employees Attendance Logs</h3>
          <AttendanceTable logs={logs} />
        </motion.div>
      </main>
    </div>
  );
};
