// eas-app/src/components/AddUserCard.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle } from "lucide-react";
import axios from "axios";
import Button from "./Button"; // your shared Button component

const Card = styled(motion.div)`
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  max-width: 500px;
  margin-top: 1rem;
`;

const Form = styled.form`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  border: 1px solid #cbd5e1;
  outline: none;
  font-size: 1rem;

  &:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  border: 1px solid #cbd5e1;
  font-size: 1rem;

  &:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

export const AddUserCard: React.FC<{ apiBase?: string }> = ({ apiBase = "/api" }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Employee", department: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`${apiBase}/employees`, form);
    setForm({ name: "", email: "", role: "Employee", department: "" });
    setOpen(false);
  };

  return (
    <div className="mb-6">
      <Button onClick={() => setOpen((prev) => !prev)}>
        <PlusCircle className="w-5 h-5 mr-2" />
        {open ? "Hide Add User" : "Add New User"}
      </Button>

      <AnimatePresence initial={false}>
        {open && (
          <Card
            key="add-user-card"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Form onSubmit={submit}>
              <Input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div style={{ display: "flex", gap: "1rem" }}>
                <Select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option>Employee</option>
                  <option>Admin</option>
                  <option>Manager</option>
                </Select>
                <Input
                  placeholder="Department"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>
              <ButtonGroup>
                <Button type="submit" variant="primary">
                  Create
                </Button>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </ButtonGroup>
            </Form>
          </Card>
        )}
      </AnimatePresence>
    </div>
  );
};
