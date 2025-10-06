import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContent";

interface Props {
  onFilter: (filteredLogs: any[]) => void; // callback to pass filtered logs to parent
}

export const LogFilter = ({ onFilter }: Props) => {
  const { user } = useAuth();
  const [employeeId, setEmployeeId] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);

  const fetchEmployees = async () => {
    if (!user) return;
    const res = await api.get(`/admin/users?admin_id=${user.id}`);
    setEmployees(res.data);
  };

  const fetchLogs = async () => {
    if (!user) return;
    let url = `/admin/all-logs?admin_id=${user.id}`;
    if (employeeId) url += `&user_id=${employeeId}`;
    if (date) url += `&date=${date}`;
    const res = await api.get(url);
    onFilter(res.data); // pass filtered logs to parent component
  };

  useEffect(() => {
    fetchEmployees();
    fetchLogs();
  }, []);

  const handleFilter = (e: any) => {
    e.preventDefault();
    fetchLogs();
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
      <h3 className="text-lg mb-2">Filter Logs</h3>
      <form onSubmit={handleFilter} className="flex gap-2 mb-2">
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value="">All Employees</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Filter</button>
      </form>
    </div>
  );
};
