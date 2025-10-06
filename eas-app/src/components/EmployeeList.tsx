import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContent";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Props {
  onSelectEmployee?: (id: number) => void; // optional callback for admin
}

export const EmployeeList = ({ onSelectEmployee }: Props) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [message, setMessage] = useState("");

  const fetchEmployees = async () => {
    if (!user) return;
    const res = await api.get(`/admin/users?admin_id=${user.id}`);
    setEmployees(res.data);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/delete-user/${id}?admin_id=${user?.id}`);
      setMessage("User deleted successfully");
      fetchEmployees();
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Error deleting user");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
      <h3 className="text-lg mb-2">Employee List</h3>
      {message && <p className="text-blue-700 mb-2">{message}</p>}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Role</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectEmployee && onSelectEmployee(emp.id)}
            >
              <td className="border px-2 py-1">{emp.id}</td>
              <td className="border px-2 py-1">{emp.name}</td>
              <td className="border px-2 py-1">{emp.email}</td>
              <td className="border px-2 py-1">{emp.role}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering row click
                    handleDelete(emp.id);
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
