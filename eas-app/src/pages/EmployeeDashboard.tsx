import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContent";
import { getLogs } from "../services/attendanceService";
import { api } from "../services/api";
import { CalendarDays, LogOut, Clock, User } from "lucide-react";
import { AttendanceTable } from "../components/AttendanceTable";
import { Switch } from "@headlessui/react";
import { motion } from "framer-motion";
import { checkIn, checkOut } from "../services/attendanceService";


export const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    first_in: null,
    final_out: null,
    total_duration: null,
  });
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    if (user) {
      const data = await getLogs(user.id);
      setLogs(data || []);
    }
  };

  const fetchSummary = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/attendance/today-summary?current_user_id=${user.id}`);
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
  
  const handleToggle = async () => {
  if (!user) return;
  setLoading(true);
  try {
    if (isCheckedIn) {
      await checkOut(user.id);
    } else {
      await checkIn(user.id);
    }
    setIsCheckedIn(!isCheckedIn);
    await fetchLogs();
    await fetchSummary();
  } catch (err) {
    console.error("Error toggling check-in/out:", err);
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
      {/* Header */}
      <header className="flex items-center justify-between bg-black text-white px-6 py-4 shadow">
        <h1 className="text-2xl font-semibold">EAS Portal</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{user.name}</span>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded hover:bg-gray-700">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <div
              className="absolute hidden group-hover:block right-0 mt-2 w-32 bg-white text-black rounded shadow-md text-sm"
              onClick={logout}
            >
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        {/* Welcome */}
        <h2 className="text-xl mb-6">Welcome, {user.name}</h2>

        {/* Toggle for Check-In / Check-Out */}
        <div className="flex items-center gap-3 mb-8">
          <Switch
            checked={isCheckedIn}
            onChange={handleToggle}
            className={`${
              isCheckedIn ? "bg-green-500" : "bg-gray-300"
            } relative inline-flex h-6 w-12 items-center rounded-full transition`}
            disabled={loading}
          >
            <span
              className={`${
                isCheckedIn ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform bg-white rounded-full transition`}
            />
          </Switch>
          <span className="font-medium">
            {loading ? "Processing..." : isCheckedIn ? "Checked In" : "Checked Out"}
          </span>
        </div>

        {/* Today's Summary Card */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-blue-500 w-5 h-5" />
            <h3 className="text-lg font-semibold">Today's Summary</h3>
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

        {/* Attendance Logs (Calendar View or Table) */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="text-blue-500 w-5 h-5" />
            <h3 className="text-lg font-semibold">Attendance Logs</h3>
          </div>
          {logs.length > 0 ? (
            <AttendanceTable logs={logs} />
          ) : (
            <p className="text-gray-500 text-center py-4">No attendance logs found.</p>
          )}
        </motion.div>
      </main>
    </div>
  );
};
