export interface AttendanceLog {
  user_id: number;
  check_in?: string;
  check_out?: string;
  method: string;
}
