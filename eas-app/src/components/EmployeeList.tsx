// src/components/EmployeeList.tsx
import { useState, useEffect } from "react";
import Button from "./Button";
import { Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

interface Employee {
  id: number;
  name: string;
  email: string;
}

interface EmployeeListProps {
  onSelectEmployee: (id: number) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ onSelectEmployee }) => {
  const [showList, setShowList] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Fetch employees (replace with your API)
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees"); // your endpoint
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div>
      {/* Toggle Button */}
      <Button onClick={() => setShowList(!showList)}>
        <Users className="w-5 h-5" />
        {showList ? "Hide Employee List" : "View Employee List"}
      </Button>

      {/* Employee List Card */}
      <AnimatePresence initial={false}>
        {showList && (
          <motion.div
            key="employee-list-card"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              {employees.length === 0 && (
                <p className="text-gray-500 text-center py-4">No employees found</p>
              )}
              {employees.map((emp) => (
                <EmployeeItem
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp.id)}
                >
                  {emp.name} — {emp.email}
                </EmployeeItem>
              ))}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Styled components
const Card = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-top: 12px;
  max-height: 300px; /* Scrollable max height */
  overflow-y: auto;
  padding: 12px;
`;

const EmployeeItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background-color: #f0f4f8;
  }
`;
