import React, { useState } from "react";
import axios from "axios";

export const AddUserCard: React.FC<{ apiBase?: string }> = ({ apiBase = "/api" }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Employee", department: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`${apiBase}/employees`, form);
    setForm({ name: "", email: "", role: "Employee", department: "" });
    setOpen(false);
    // optionally trigger refresh event
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Create user</h3>
        <button onClick={() => setOpen(s => !s)} className="btn btn-sm">{open ? "Close" : "Create user"}</button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-3 space-y-2">
          <input required placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border px-2 py-1 rounded" />
          <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border px-2 py-1 rounded" />
          <div className="flex gap-2">
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="border px-2 py-1 rounded">
              <option>Employee</option>
              <option>Admin</option>
              <option>Manager</option>
            </select>
            <input placeholder="Department" value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="border px-2 py-1 rounded flex-1" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">Create</button>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};
