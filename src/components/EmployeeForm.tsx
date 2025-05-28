import React from 'react';
import {
    Box,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Select,
    MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import type { ComponentType } from '../interface/ComponentType';

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

interface EmployeeDetailFormProps {
    data: EmployeeData;
    onChange: (key: keyof EmployeeData, value: any) => void;
    componentType: ComponentType;
    t: (key: string) => string;
}

const selectOption = [
    { value: 'D001', labelKey: 'departmentHr' },
    { value: 'D002', labelKey: 'departmentIt' },
    { value: 'D003', labelKey: 'departmentFinance' },
    { value: 'D004', labelKey: 'departmentOperations' }
];

const Label = ({ text }: { text: string }) => (
    <Box
        sx={{
            minWidth: '80px',
            backgroundColor: '#A0522D',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: 14,
            fontWeight: 500,
            whiteSpace: 'nowrap',
        }}
    >
        {text}
    </Box>
);

const FormRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <Box
        sx={{
            display: 'flex',
            width: 'calc(50% - 8px)',
            minWidth: '400px',
            gap: 1,
            alignItems: 'center',
        }}
    >
        <Label text={label} />
        {children}
    </Box>
);

export default function EmployeeDetailForm({
    data,
    onChange,
    componentType,
    t,
}: EmployeeDetailFormProps) {
    const handleDateChange = (key: keyof EmployeeData, date: Dayjs | null) => {
        onChange(key, date ? date.format('YYYY-MM-DD') : '');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'space-between',
                p: 2,
                maxWidth: '1000px',
                mx: 'auto',
            }}
        >
            <FormRow label={t('employeeId')}>
                <TextField
                    value={data.employeeId}
                    onChange={(e) => onChange('employeeId', e.target.value)}
                    InputProps={{ readOnly: componentType !== 'Create' }}
                    fullWidth
                    size="small"
                />
            </FormRow>
            <FormRow label={t('employeeName')}>
                <TextField
                    value={data.employeeName}
                    onChange={(e) => onChange('employeeName', e.target.value)}
                    InputProps={{ readOnly: componentType === 'Detail' }}
                    fullWidth
                    size="small"
                />
            </FormRow>
            <FormRow label={t('employeeEmail')}>
                <TextField
                    value={data.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    InputProps={{ readOnly: componentType === 'Detail' }}
                    fullWidth
                    size="small"
                />
            </FormRow>
            <FormRow label={t('employeeDepartment')}>
                {
                    componentType === 'Detail' ? (
                        <TextField
                            value={t(selectOption.find(opt => opt.value === data.departmentId)?.labelKey || '')}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            size="small"
                        />
                    ) : (
                        <Select
                            value={data.departmentId}
                            onChange={(e) => onChange('departmentId', e.target.value)}
                            size="small"
                            fullWidth
                        >
                            {selectOption.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {t(item.labelKey)}
                                </MenuItem>
                            ))}
                        </Select>
                    )
                }
            </FormRow>
            <FormRow label={t('employeeStatus')}>
                {
                    componentType === 'Detail' ? (
                        <TextField
                            value={data.status === "Y" ? t('on') : t('of')}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            size="small"
                        />
                    ) : (
                        <RadioGroup
                            row
                            value={data.status}
                            onChange={(e) => onChange('status', e.target.value)}
                        >
                            <FormControlLabel value="Y" control={<Radio />} label={t('on')} />
                            <FormControlLabel value="N" control={<Radio />} label={t('off')} />
                        </RadioGroup>
                    )
                }
            </FormRow>
            <FormRow label={t('employeeGender')}>
                {
                    componentType === 'Detail' ? (
                        <TextField
                            value={data.gender === "M" ? t('genderMale') : t('genderFemale')}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            size="small"
                        />
                    ) : (
                        <RadioGroup
                            row
                            value={data.gender}
                            onChange={(e) => onChange('gender', e.target.value)}
                        >
                            <FormControlLabel value="M" control={<Radio />} label={t('genderMale')} />
                            <FormControlLabel value="F" control={<Radio />} label={t('genderFemale')} />
                        </RadioGroup>
                    )
                }
            </FormRow>
            <FormRow label={t('employeebirth')}>
                {
                    componentType === 'Detail' ? (
                        <TextField
                            value={data.birth}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            size="small"
                        />
                    ) : (
                        <DatePicker
                            value={data.birth ? dayjs(data.birth) : null}
                            onChange={(date) => handleDateChange('birth', date)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                },
                            }}
                        />
                    )
                }
            </FormRow>
            <FormRow label={t('employeeStartDate')}>
                {
                    componentType === 'Detail' ? (
                        <TextField
                            value={data.startDate}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            size="small"
                        />
                    ) : (
                        <DatePicker
                            value={data.startDate ? dayjs(data.startDate) : null}
                            onChange={(date) => handleDateChange('startDate', date)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                },
                            }}
                        />
                    )
                }
            </FormRow>
            <FormRow label={t('employeePhone')}>
                <TextField
                    value={data.phone}
                    onChange={(e) => {
                        const phone = e.target.value;
                        if (/^\d{0,10}$/.test(phone)) {
                            onChange('phone', phone);
                        }
                    }}
                    InputProps={{ readOnly: componentType === 'Detail' }}
                    fullWidth
                    size="small"
                />
            </FormRow>
            {
                componentType !== 'Create' && (
                    <>
                        <FormRow label={t('employeeModifyBy')}>
                            <TextField
                                value={data.modifyBy}
                                inputProps={{ readOnly: true }}
                                fullWidth
                                size="small"
                            />
                        </FormRow>
                        <FormRow label={t('employeeModifyDate')}>
                            <TextField
                                value={data.modifyDate}
                                InputProps={{ readOnly: true }}
                                fullWidth
                                size="small"
                            />
                        </FormRow>
                    </>
                )
            }
        </Box>
    );
}
