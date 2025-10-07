import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

type Employee = {
  id: number;
  name: string;
  email?: string;
  role?: string;
  department?: string;
};

type LogItem = {
  id: number;
  employee_id: number;
  check_in: string | null;
  check_out: string | null;
  duration_seconds: number | null;
  date: string; // YYYY-MM-DD
};

export const EmployeeTableCard: React.FC<{
  apiBase?: string;
}> = ({ apiBase = "/api" }) => {
  const [query, setQuery] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [open, setOpen] = useState(true);
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // search triggered only on explicit search - until then show "no data"
  const searchEmployees = async () => {
    if (!query.trim()) {
      setEmployees(null);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiBase}/employees/search`, { params: { q: query, department: filterDept }});
      setEmployees(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (employeeId: number) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiBase}/attendance/logs`, { params: { employee_id: employeeId }});
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (e: Employee) => {
    // open modal or inline edit — simplified here as prompt
    const newName = prompt("Edit name", e.name);
    if (!newName) return;
    axios.patch(`${apiBase}/employees/${e.id}`, { name: newName }).then(() => {
      setEmployees(prev => prev?.map(it => (it.id === e.id ? { ...it, name: newName } : it)) ?? prev);
    });
  };

  const onDelete = (e: Employee) => {
    if (!confirm(`Delete ${e.name}?`)) return;
    axios.delete(`${apiBase}/employees/${e.id}`).then(() => {
      setEmployees(prev => prev?.filter(it => it.id !== e.id) ?? prev);
    });
  };

  // compute total duration from logs
  const totalDuration = useMemo(() => {
    return logs.reduce((acc, l) => acc + (l.duration_seconds ?? 0), 0);
  }, [logs]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-4 w-full">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Employee list</h3>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employees (press Search)"
            className="border rounded px-2 py-1 text-sm"
          />
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="border rounded px-2 py-1 text-sm">
            <option value="">All depts</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
          </select>
          <button onClick={searchEmployees} className="btn btn-sm">Search</button>
          <button onClick={() => { setOpen(!open); }} className="btn btn-ghost">{open ? "Collapse" : "Expand"}</button>
        </div>
      </div>

      {!open ? (
        <div className="mt-3 text-sm text-gray-500">List collapsed — expand to view employees.</div>
      ) : (
        <>
          <div className="mt-3">
            {employees === null ? (
              <div className="text-sm text-gray-500">No data. Use the search to load employees.</div>
            ) : loading ? (
              <div>Loading...</div>
            ) : employees.length === 0 ? (
              <div className="text-sm text-gray-500">No results</div>
            ) : (
              <div className="space-y-2">
                {employees.map(emp => (
                  <div key={emp.id} className="border rounded p-2 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{emp.name} <span className="text-xs text-gray-500">({emp.role ?? "—"})</span></div>
                      <div className="text-xs text-gray-500">{emp.department ?? "—"} • {emp.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelectedEmployee(emp); fetchLogs(emp.id); }} className="px-2 py-1 text-sm border rounded">View Logs</button>
                      <button onClick={() => onEdit(emp)} className="px-2 py-1 text-sm border rounded">Edit</button>
                      <button onClick={() => onDelete(emp)} className="px-2 py-1 text-sm border rounded text-red-600">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* logs panel */}
          {selectedEmployee && (
            <div className="mt-4 border-t pt-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Logs for {selectedEmployee.name}</h4>
                <div className="text-sm">Total duration: {(totalDuration / 3600).toFixed(2)} hrs</div>
              </div>
              <div className="mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500">
                      <th>Date</th><th>Check-in</th><th>Check-out</th><th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(l => (
                      <tr key={l.id}>
                        <td className="py-1">{l.date}</td>
                        <td>{l.check_in ? new Date(l.check_in).toLocaleTimeString() : "—"}</td>
                        <td>{l.check_out ? new Date(l.check_out).toLocaleTimeString() : "—"}</td>
                        <td>{l.duration_seconds ? new Date(l.duration_seconds * 1000).toISOString().substr(11, 8) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
