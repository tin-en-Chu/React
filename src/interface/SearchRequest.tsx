import type { Dayjs } from "dayjs";

export interface SearchRequest {
  employeeId?: string;
  startDate?: string | null;
  endDate?: string | null;
  departmentId?: string | null;
  status: string | null;
}
