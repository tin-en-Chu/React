// components/SearchForm.tsx
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
}

//展示用寫死
const selectOption = [
    { value: '', label: '全部部門' },
    { value: 'D001', label: '人資部' },
    { value: 'D002', label: '資訊部' },
    { value: 'D003', label: '財務部' },
    { value: 'D004', label: '營運部' }
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


const SearchForm = ({ onSearch }: Props) => {
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
                    <LabelBox label="關鍵字" />
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
                    <LabelBox label="搜尋時間" />
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
                            label="起始"
                            value={dayjs(formData.startDate)}
                            onChange={(date) => handleChange('startDate', date)}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                        <DatePicker
                            label="結束"
                            value={dayjs(formData.endDate)}
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
                    <LabelBox label="部門" />
                    <FormControl size="small" fullWidth sx={{ ml: 1 }}>
                        <InputLabel>部門</InputLabel>
                        <Select
                            label="部門"
                            value={formData.departmentId}
                            onChange={(e) => handleChange('departmentId', e.target.value)}
                        >
                            {selectOption.map((item) => (
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
                    <LabelBox label="是否啟用" />
                    <RadioGroup
                        row
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        name="enabled"
                        sx={{ ml: 1 }}
                    >
                        <FormControlLabel value="yes" control={<Radio size="small" />} label="是" />
                        <FormControlLabel value="no" control={<Radio size="small" />} label="否" />
                    </RadioGroup>
                </Box>
            </Box>

            {/* 搜尋按鈕 */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', mt: 1 }}>
                <Button variant="outlined" color="info" onClick={handleSubmit}>
                    搜尋
                </Button>
                <Button
                    variant="outlined" color="info" onClick={() => {
                        setFormData(initialFormData);
                        onSearch(initialFormData); //清除後在查一次達成reload功能
                    }}
                >
                    清除
                </Button>
            </Box>
        </Box>
    );
};

export default SearchForm;