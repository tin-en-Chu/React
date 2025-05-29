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
import { initialFormData, type SearchRequest } from '../interface/SearchRequest';
import dayjs from 'dayjs';
import { selectOption } from '../interface/Data';
import { LabelBox } from '../interface/ComponentType';

interface Props {
    onSearch: (values: SearchRequest) => void;
    onDelete: () => void;
    onInsert: (event: React.MouseEvent) => void;
    t: (key: string) => string;
}
/**
 * 用於查詢列的組件
 */
const SearchForm = ({ onSearch, onDelete, onInsert, t }: Props) => {
    const [formData, setFormData] = useState<SearchRequest>(initialFormData);//紀錄req的狀態
    //處理每個欄位的變更事件更新搜尋列的狀態
    //...prev => 原欄位的值
    //[field]: value => 新欄位的值
    const handleChange = (field: keyof SearchRequest, value: any) => {
        setFormData(prev => {
            if (prev[field] === value) {
                return prev; // 沒變就不更新
            }
            return { ...prev, [field]: value };// 變了就更新
        });
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
                            {selectOption.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {t(item.labelKey)}
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
                        setFormData(initialFormData);// 搜尋狀態清空
                        onSearch(initialFormData); // 清除後查一次達成reload功能
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
