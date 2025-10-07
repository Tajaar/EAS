import { useState, useEffect } from "react";
import styled from "styled-components";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContent";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";

interface Props {
  onFilter: (filteredLogs: any) => void;
}

export const LogFilter = ({ onFilter }: Props) => {
  const { user } = useAuth();
  const [employeeId, setEmployeeId] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [searchClicked, setSearchClicked] = useState(false);
  const [month, setMonth] = useState(dayjs());

  // Fetch employees
  const fetchEmployees = async () => {
    if (!user) return;
    const res = await api.get(`/admin/users?admin_id=${user.id}`);
    setEmployees(res.data);
  };

  // Fetch logs
  const fetchLogs = async () => {
    if (!user) return;
    let url = `/admin/all-logs?admin_id=${user.id}`;
    if (employeeId) url += `&user_id=${employeeId}`;
    if (date) url += `&date=${date}`;
    const res = await api.get(url);
    setLogs(res.data);
    onFilter(res.data);
    setSearchClicked(true);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const groupedLogs: Record<string, any[]> = logs.reduce((acc: any, log: any) => {
    const day = dayjs(log.check_in).format("YYYY-MM-DD");
    if (!acc[day]) acc[day] = [];
    acc[day].push(log);
    return acc;
  }, {});

  const startOfMonth = month.startOf("month");
  const endOfMonth = month.endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const handlePrevMonth = () => setMonth(month.subtract(1, "month"));
  const handleNextMonth = () => setMonth(month.add(1, "month"));

  return (
    <Wrapper>
      <Title>Search Employee Logs</Title>
      <FilterForm onSubmit={(e) => { e.preventDefault(); fetchLogs(); }}>
        <Select value={employeeId} onChange={(e) => setEmployeeId(Number(e.target.value))}>
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
          ))}
        </Select>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Button type="submit">Search</Button>
      </FilterForm>

      {searchClicked && (
        <CalendarContainer>
          <MonthNavigation>
            <NavButton onClick={handlePrevMonth}>Prev</NavButton>
            <MonthTitle>{month.format("MMMM YYYY")}</MonthTitle>
            <NavButton onClick={handleNextMonth}>Next</NavButton>
          </MonthNavigation>

          <Weekdays>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <Day key={day}>{day}</Day>)}
          </Weekdays>

          <CalendarGrid>
            {calendarDays.map((day, idx) => {
              if (!day) return <EmptyCell key={idx} />;
              const dayKey = month.date(day).format("YYYY-MM-DD");
              const logsForDay = groupedLogs[dayKey] || [];
              const totalDurationMs = logsForDay.reduce((acc, log) => {
                if (log.check_in && log.check_out) {
                  return acc + (new Date(log.check_out).getTime() - new Date(log.check_in).getTime());
                }
                return acc;
              }, 0);
              const hours = Math.floor(totalDurationMs / (1000 * 60 * 60));
              const minutes = Math.floor((totalDurationMs % (1000 * 60 * 60)) / (1000 * 60));

              return <DayCell key={dayKey} day={day} logs={logsForDay} duration={`${hours}h ${minutes}m`} />;
            })}
          </CalendarGrid>
        </CalendarContainer>
      )}
    </Wrapper>
  );
};

// Single Day Cell Component
const DayCell = ({ day, logs, duration }: { day: number; logs: any[]; duration: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <DayCellWrapper>
      <DayNumber onClick={() => setExpanded(!expanded)}>{day}</DayNumber>
      {logs.length > 0 && <DurationText>{duration}</DurationText>}

      <AnimatePresence>
        {expanded && logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <LogsTable>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx}>
                    <td>{log.user_name || log.user_id}</td>
                    <td>{log.check_in || "-"}</td>
                    <td>{log.check_out || "-"}</td>
                    <td>{log.method}</td>
                  </tr>
                ))}
              </tbody>
            </LogsTable>
          </motion.div>
        )}
      </AnimatePresence>
    </DayCellWrapper>
  );
};

// Styled Components
const Wrapper = styled.div`
  width: 100%;
  max-width: 100%; // full horizontal stretch
  margin: 0 auto;
  background: #f9f9f9;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
`;

const FilterForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: space-between; // stretch inputs
  width: 100%;
`;

const Select = styled.select`
  flex: 1 1 30%; // responsive and stretches
  min-width: 150px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Input = styled.input`
  flex: 1 1 30%; // responsive and stretches
  min-width: 140px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  flex: 1 1 20%; // responsive, adjusts with screen
  min-width: 120px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: #1976d2;
  color: #fff;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #115293;
  }
`;


const Title = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
`;

const CalendarContainer = styled.div`
  margin-top: 16px;
`;

const MonthNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const NavButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: #e0e0e0;
  cursor: pointer;
  &:hover {
    background: #bdbdbd;
  }
`;

const MonthTitle = styled.h4`
  font-weight: 600;
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  color: #555;
  margin-bottom: 4px;
`;

const Day = styled.div``;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

const EmptyCell = styled.div`
  height: 80px;
`;

const DayCellWrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 6px;
  text-align: center;
  cursor: pointer;
`;

const DayNumber = styled.div`
  font-weight: 600;
`;

const DurationText = styled.div`
  font-size: 0.85rem;
  color: #2e7d32;
  margin-top: 2px;
`;

const LogsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 6px;

  th, td {
    border: 1px solid #ccc;
    padding: 4px 6px;
    font-size: 0.75rem;
  }

  th {
    background: #f0f0f0;
    font-weight: 600;
  }
`;
