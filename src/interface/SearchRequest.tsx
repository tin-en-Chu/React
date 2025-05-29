export interface SearchRequest {
  employeeId?: string;
  startDate?: string | null;
  endDate?: string | null;
  departmentId?: string | null;
  status?: string | null;
}
export const initialFormData: SearchRequest = {
    employeeId: '',
    startDate: null,
    endDate: null,
    departmentId: '',
    status: null,
};

