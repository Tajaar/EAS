import { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContent";

export const AddUserForm = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "employee">("employee");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/add-user", {
        name,
        email,
        password,
        role,
        admin_id: user?.id,
      });
      setMessage(`User ${res.data.name} added successfully!`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("employee");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Error adding user");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
      <h3 className="text-lg mb-2">Add New User</h3>
      {message && <p className="mb-2 text-blue-700">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "employee")}
          className="border p-2 rounded"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-green-500 text-white p-2 rounded mt-2">
          Add User
        </button>
      </form>
    </div>
  );
};
