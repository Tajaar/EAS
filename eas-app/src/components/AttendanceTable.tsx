import type { AttendanceLog } from "../types/attendance";
import styled from "styled-components";

interface Props {
  logs: AttendanceLog[];
}

export const AttendanceTable = ({ logs }: Props) => {
  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <Th>Check In</Th>
            <Th>Check Out</Th>
            <Th>Method</Th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <Tr key={idx}>
              <Td>{log.check_in || "-"}</Td>
              <Td>{log.check_out || "-"}</Td>
              <Td>{log.method}</Td>
            </Tr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

// Styled Components
const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  padding: 12px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 500px;

  thead {
    background: #b71c1c;
    color: #fff;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background: #f9f9f9;
  }

  &:hover {
    background: rgba(211, 47, 47, 0.1);
  }
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
`;
