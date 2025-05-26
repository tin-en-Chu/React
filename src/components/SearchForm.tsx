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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const selectOption: { label: string; value: string }[] = [
  {
    value: 'all',
    label: '全部',
  },
  {
    value: 'enabled',
    label: '啟用',
  },
  {
    value: 'disabled',
    label: '停用',
  },
];

const SearchForm = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      {/* 第一列：關鍵字 + 搜尋時間 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* 關鍵字 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ whiteSpace: 'nowrap' }}>關鍵字 :</Box>
          <TextField variant="outlined" size="small" />
        </Box>

        {/* 搜尋時間 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ whiteSpace: 'nowrap' }}>搜尋時間 :</Box>
          <DatePicker label="起始" slotProps={{ textField: { size: 'small' } }} />
          <DatePicker label="結束" slotProps={{ textField: { size: 'small' } }} />
        </Box>
      </Box>

      {/* 第二列：部門 + 是否啟用 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* 部門 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ whiteSpace: 'nowrap' }}>部門 :</Box>
          <FormControl size="small">
            <InputLabel>部門</InputLabel>
            <Select label="部門" defaultValue="">
              {selectOption.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* 是否啟用 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ whiteSpace: 'nowrap' }}>是否啟用 :</Box>
          <RadioGroup row defaultValue="yes" name="enabled">
            <FormControlLabel value="yes" control={<Radio size="small" />} label="是" />
            <FormControlLabel value="no" control={<Radio size="small" />} label="否" />
          </RadioGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchForm;
