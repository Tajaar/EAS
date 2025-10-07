// src/components/AddUserCard.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../services/api";

interface AddUserCardProps {}

export const AddUserCard: React.FC<AddUserCardProps> = () => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "employee",
    password: "",
    department: "",
});

  const toggleExpand = () => setExpanded(!expanded);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post("/users", formData);

      if (res.status === 201 || res.status === 200) {
        setMessage({ type: "success", text: "✅ User added successfully!" });
        setFormData({ name: "", email: "", role: "employee", password: "", department: "" });
      } else {
        setMessage({ type: "error", text: "⚠️ Failed to add user. Please try again." });
      }
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "Server error. Please check backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <ToggleButton onClick={toggleExpand}>
        {expanded ? "− Hide Add User" : "+ Add New User"}
      </ToggleButton>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="add-user-form"
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card>
              <h3>Add Employee or Admin</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Department (optional)</label>
                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter department"
                  />
                </div>

                <SubmitButton type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add User"}
                </SubmitButton>

                {message && <Message type={message.type}>{message.text}</Message>}
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

// Styled Components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ToggleButton = styled.button`
  background: linear-gradient(90deg, #d32f2f, #b71c1c);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  width: 90%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(211, 47, 47, 0.3);

  &:hover {
    background: linear-gradient(90deg, #b71c1c, #880e0e);
    transform: scale(1.03);
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 24px;
  margin-top: 16px;
  width: 90%;
  max-width: 480px;
  overflow: hidden;

  h3 {
    text-align: center;
    margin-bottom: 16px;
    color: #b71c1c;
    font-weight: 700;
    font-size: 1.2rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    font-weight: 600;
    margin-bottom: 5px;
    color: #333;
  }

  input,
  select {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    font-size: 15px;
    transition: 0.3s ease;
    background-color: #fff;

    &:focus {
      border-color: #d32f2f;
      outline: none;
      box-shadow: 0 0 5px rgba(211, 47, 47, 0.3);
    }
  }
`;

const SubmitButton = styled.button`
  background: #d32f2f;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
  margin-top: 8px;

  &:hover {
    background: #b71c1c;
    transform: scale(1.02);
  }

  &:disabled {
    background: #aaa;
    cursor: not-allowed;
    transform: none;
  }
`;

const Message = styled.p<{ type: "success" | "error" }>`
  margin-top: 10px;
  font-weight: 500;
  text-align: center;
  color: ${(props) => (props.type === "success" ? "#2e7d32" : "#c62828")};
`;
