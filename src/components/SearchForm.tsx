import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import type { SearchRequest } from '../interface/SearchRequest';
import dayjs from 'dayjs';

interface Props {
    onSearch: (values: SearchRequest) => void;
    onDelete: () => void;
    onInsert: (event: React.MouseEvent) => void;
    t: (key: string) => string; 
}

// 多語系後部門選項
const selectOption = (t: (key: string) => string) => [
    { value: '', label: t('allDepartments') },
    { value: 'D001', label: t('departmentHr') },
    { value: 'D002', label: t('departmentIt') },
    { value: 'D003', label: t('departmentFinance') },
    { value: 'D004', label: t('departmentOperations') }
];

const LabelBox = ({ label }: { label: string }) => (
    <Box sx={{ minWidth: 70, whiteSpace: 'nowrap', fontWeight: 500 }}>{label} :</Box>
);

const initialFormData: SearchRequest = {
    employeeId: '',
    startDate: null,
    endDate: null,
    departmentId: '',
    status: null,
};

const SearchForm = ({ onSearch, onDelete, onInsert , t }: Props) => {
    

    //紀錄req的state
    const [formData, setFormData] = useState<SearchRequest>(initialFormData);

    const handleChange = (field: keyof SearchRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    //處理req資料
    const handleSubmit = () => {
        const transformedData = {
            ...formData,
            startDate: formData.startDate ? dayjs(formData.startDate).format('YYYY-MM-DD') : null,
            endDate: formData.endDate ? dayjs(formData.endDate).format('YYYY-MM-DD') : null,
            status:
                formData.status === 'yes' ? 'Y' : (formData.status === 'no' ? 'N' : null),
        };
        onSearch(transformedData);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
            {/* 第一列：關鍵字 + 搜尋時間 */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                }}
            >
                {/* 關鍵字 */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: { xs: '100%', sm: '45%' },
                    }}
                >
                    <LabelBox label={t('keyword')} />
                    <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ ml: 1 }}
                        value={formData.employeeId}
                        onChange={e => handleChange('employeeId', e.target.value)}
                    />
                </Box>

                {/* 搜尋時間 */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        minWidth: { xs: '100%', sm: '50%' },
                    }}
                >
                    <LabelBox label={t('searchPeriod')} />
                    <Box
                        sx={{
                            ml: { xs: 0, sm: 2 },
                            mt: { xs: 1, sm: 0 },
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 1,
                            flexGrow: 1,
                        }}
                    >
                        <DatePicker
                            label={t('start')}
                            value={formData.startDate ? dayjs(formData.startDate) : null}
                            onChange={(date) => handleChange('startDate', date)}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                        <DatePicker
                            label={t('end')}
                            value={formData.endDate ? dayjs(formData.endDate) : null}
                            onChange={(date) => handleChange('endDate', date)}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* 第二列：部門 + 是否啟用 */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                }}
            >
                {/* 部門 */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: { xs: '100%', sm: '45%' },
                    }}
                >
                    <LabelBox label={t('department')} />
                    <FormControl size="small" fullWidth sx={{ ml: 1 }}>
                        <InputLabel>{t('department')}</InputLabel>
                        <Select
                            label={t('department')}
                            value={formData.departmentId}
                            onChange={(e) => handleChange('departmentId', e.target.value)}
                        >
                            {selectOption(t).map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* 是否啟用 */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: { xs: '100%', sm: '50%' },
                        flexWrap: 'wrap',
                    }}
                >
                    <LabelBox label={t('status')} />
                    <RadioGroup
                        row
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        name="enabled"
                        sx={{ ml: 1 }}
                    >
                        <FormControlLabel value="yes" control={<Radio size="small" />} label={t('on')} />
                        <FormControlLabel value="no" control={<Radio size="small" />} label={t('off')} />
                    </RadioGroup>
                </Box>
            </Box>

            {/* 按鈕列 */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', mt: 1 }}>
                <Button variant="outlined" color="info" onClick={handleSubmit}>
                    {t('search')}
                </Button>
                <Button
                    variant="outlined"
                    color="info"
                    onClick={() => {
                        setFormData(initialFormData);
                        onSearch(initialFormData); //清除後查一次達成reload功能
                    }}
                >
                    {t('clear')}
                </Button>
                <Button variant="outlined" color="info" onClick={onInsert}>
                    {t('insert')}
                </Button>
                <Button variant="contained" color="error" onClick={onDelete}>
                    {t('batchDelete')}
                </Button>
            </Box>
        </Box>
    );
};

export default SearchForm;
