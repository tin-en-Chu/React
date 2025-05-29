export interface EmployeeData {
    employeeId: string;
    employeeName: string;
    departmentId: string;
    gender: string;
    birth: string;
    email: string;
    startDate: string;
    phone: string;
    modifyBy: string;
    modifyDate: string;
    status: string;
}
export const selectOption = [
    { value: 'D001', labelKey: 'departmentHr' },
    { value: 'D002', labelKey: 'departmentIt' },
    { value: 'D003', labelKey: 'departmentFinance' },
    { value: 'D004', labelKey: 'departmentOperations' }
];
export const initialData: EmployeeData = {
    employeeId: '',
    employeeName: '',
    departmentId: '',
    gender: '',
    birth: '',
    email: '',
    startDate: '',
    phone: '',
    modifyBy: '',
    modifyDate: '',
    status: '',
};