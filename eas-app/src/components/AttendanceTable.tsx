import type { AttendanceLog } from "../types/attendance";

interface Props {
  logs: AttendanceLog[];
}

export const AttendanceTable = ({ logs }: Props) => {
  return (
    <table className="min-w-full table-auto border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-4 py-2">Check In</th>
          <th className="border px-4 py-2">Check Out</th>
          <th className="border px-4 py-2">Method</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, idx) => (
          <tr key={idx}>
            <td className="border px-4 py-2">{log.check_in || "-"}</td>
            <td className="border px-4 py-2">{log.check_out || "-"}</td>
            <td className="border px-4 py-2">{log.method}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
