// src/components/EmployeeTable.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import styled from "styled-components";

// Styled components
const Wrapper = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background: #f9f9f9;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
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
const Day = styled.div`
  font-weight: 600;
  text-align: center;
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

// Component
interface EmployeeTableProps {
  logs: any[]; // all logs for the employee
  onFilter?: (logs: any[]) => void; // callback when a specific day is expanded or filtered
}

export const EmployeeTable = ({ logs, onFilter }: EmployeeTableProps) => {
  const [month, setMonth] = useState(dayjs());

  // group logs by day
  const groupedLogs: Record<string, any[]> = logs.reduce((acc, log) => {
    const day = dayjs(log.check_in).format("YYYY-MM-DD");
    if (!acc[day]) acc[day] = [];
    acc[day].push(log);
    return acc;
  }, {});

  // generate calendar
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
      <Title>My Attendance Calendar</Title>

      <CalendarContainer>
        <MonthNavigation>
          <NavButton onClick={handlePrevMonth}>Prev</NavButton>
          <MonthTitle>{month.format("MMMM YYYY")}</MonthTitle>
          <NavButton onClick={handleNextMonth}>Next</NavButton>
        </MonthNavigation>

        <Weekdays>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <Day key={d}>{d}</Day>
          ))}
        </Weekdays>

        <CalendarGrid>
          {calendarDays.map((day, idx) => {
            if (!day) return <EmptyCell key={idx} />;

            const dayKey = month.date(day).format("YYYY-MM-DD");
            const logsForDay = groupedLogs[dayKey] || [];
            const totalDuration = logsForDay.reduce((acc, log) => {
              if (log.check_in && log.check_out) {
                return acc + (new Date(log.check_out).getTime() - new Date(log.check_in).getTime());
              }
              return acc;
            }, 0);
            const hours = Math.floor(totalDuration / (1000 * 60 * 60));
            const minutes = Math.floor((totalDuration % (1000 * 60 * 60)) / (1000 * 60));
            const durationStr = `${hours}h ${minutes}m`;

            return (
              <DayCell
                key={dayKey}
                day={day}
                logs={logsForDay}
                duration={durationStr}
                onExpand={(dayLogs) => onFilter?.(dayLogs)} // pass logs back to parent
              />
            );
          })}
        </CalendarGrid>
      </CalendarContainer>
    </Wrapper>
  );
};

// DayCell component
const DayCell = ({ day, logs, duration, onExpand }: { day: number; logs: any[]; duration: string; onExpand?: (logs: any[]) => void }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
    if (!expanded) {
      onExpand?.(logs); // send day logs to parent
    } else {
      onExpand?.([]); // collapse resets logs
    }
  };

  return (
    <DayCellWrapper onClick={handleClick}>
      <DayNumber>{day}</DayNumber>
      {logs.length > 0 && <DurationText>{duration}</DurationText>}

      <AnimatePresence>
        {expanded && logs.length > 0 && (
          <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ marginTop: 4 }}>
            <LogsTable>
              <thead>
                <tr>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx}>
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
