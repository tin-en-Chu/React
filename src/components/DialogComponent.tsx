import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    type DialogProps as MuiDialogProps,
} from '@mui/material';
import type { ComponentType } from '../interface/ComponentType';
import EmployeeDetailForm, { type EmployeeData } from './EmployeeForm';
import { useEffect, useState } from 'react';

interface DialogProps {
    open: boolean;
    title?: string;
    cancelBtn?: boolean;
    comfirmBtn?: boolean;
    componentType: ComponentType;
    onClose: (result: boolean, data?: EmployeeData) => void;
    maxWidth?: MuiDialogProps['maxWidth']; // 支援 xs, sm, md, lg, xl
    data?: EmployeeData | null;
    t: (key: string) => string;  // i18n 翻譯函式型別
}

const initialData: EmployeeData = {
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

export default function DialogComponent({
    open,
    title,
    onClose,
    componentType,
    maxWidth = 'sm',
    data,
    t,
}: DialogProps) {
    const [formData, setFormData] = useState<EmployeeData>(data ?? initialData);

    const handleFieldChange = (key: keyof EmployeeData, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    // 切換組件類型或資料更新時重設表單資料
    useEffect(() => {
        if (componentType === 'Create') {
            setFormData(initialData);
        } else {
            setFormData(data ?? initialData);
        }
    }, [data, componentType]);

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth={maxWidth} fullWidth>
            <DialogTitle>
                {title}
                <IconButton
                    aria-label={t('cancel')}
                    onClick={() => onClose(false)}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    ×
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <EmployeeDetailForm
                    data={formData}
                    onChange={handleFieldChange}
                    componentType={componentType}
                    t={t} // 傳遞 t 給子組件
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={() => onClose(false)} color="error">
                    {t('cancel')}
                </Button>
                {componentType !== 'Detail' && (
                    <Button
                        onClick={() => onClose(true, formData)}
                        variant="contained"
                        color="primary"
                    >
                        {componentType === 'Create' ? t('insert') : t('edit')}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
