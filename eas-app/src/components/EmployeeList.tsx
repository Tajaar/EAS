import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { api } from "../services/api"; // your axios instance or API wrapper

interface Employee {
  id: number;
  name: string;
  role: string;
}

interface EmployeeListProps {
  onSelectEmployee?: (id: number) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ onSelectEmployee }) => {
  const [expanded, setExpanded] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch employees from backend API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users"); // Adjust endpoint as needed
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <Wrapper>
      {/* Toggle Button */}
      <ToggleButton onClick={toggleExpand}>
        <Users size={18} style={{ marginRight: "8px" }} />
        {expanded ? "Hide Employee List" : "View Employee List"}
      </ToggleButton>

      {/* Expandable Employee Card */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="employee-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              {loading ? (
                <LoadingText>Loading employees...</LoadingText>
              ) : employees.length === 0 ? (
                <LoadingText>No employees found.</LoadingText>
              ) : (
                <ScrollableList>
                  {employees.map((emp) => (
                    <EmployeeItem
                      key={emp.id}
                      onClick={() => onSelectEmployee?.(emp.id)}
                    >
                      <span className="name">{emp.name}</span>
                      <span className="role">{emp.role}</span>
                    </EmployeeItem>
                  ))}
                </ScrollableList>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

// 🧱 Styled Components

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* center the card */
  width: 100%;
`;

const ToggleButton = styled.button`
  background: linear-gradient(90deg, #d32f2f, #b71c1c);
  color: #fff;
  border: none;
  padding: 12px 24px;          /* same as AddUserCard */
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;             /* same as AddUserCard */
  width: 90%;                   /* match AddUserCard */
  max-width: 380px;             /* match AddUserCard */
  text-align: center;
  box-shadow: 0 4px 10px rgba(211, 47, 47, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: linear-gradient(90deg, #b71c1c, #880e0e);
    transform: scale(1.03);
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;          /* match AddUserCard */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 24px;                /* same padding as AddUserCard */
  margin-top: 16px;             /* consistent spacing */
  width: 90%;                   /* constrain width */
  max-width: 480px;             /* match AddUserCard */
  overflow: hidden;
`;

const ScrollableList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #b71c1c;
    border-radius: 4px;
  }

  display: flex;
  flex-direction: column;
`;

const EmployeeItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  .name {
    font-weight: 600;
  }

  .role {
    color: #666;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  color: #666;
  padding: 20px 0;
`;
