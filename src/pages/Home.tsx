import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowId } from '@mui/x-data-grid';

import { useEffect, useState, type MouseEvent } from 'react';
import SearchForm from '../components/SearchForm';
import { CustomLocaleText } from '../constants/CustomLocaleText';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import DialogComponent from '../components/DialogComponent';
import type { ComponentType } from '../interface/ComponentType';
import { DatePicker } from '@mui/x-date-pickers';

function Home() {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<ComponentType>('');
  const [dialogTitle, setDialogTitle] = useState('');

  const stopPropagation = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const onOpenDetailModal = (id: GridRowId, event: MouseEvent, dialogType: ComponentType) => {
    stopPropagation(event);
    setOpenDialog(true);
    setDialogType(dialogType);
    setDialogTitle(dialogType === 'Detail' ? '查看詳情' : '編輯資料');
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const tableColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: '操作功能',
      flex: 2,
      filterable: false,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => {
        return (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Button
              variant="outlined"
              color="info"
              onClick={e => onOpenDetailModal(params.id, e, 'Detail')}
            >
              明細
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={e => onOpenDetailModal(params.id, e, 'Edit')}
            >
              編輯
            </Button>
          </Box>
        );
      },
      headerAlign: 'center',
    },
    {
      field: 'firstName',
      headerName: '系統代碼',
      flex: 2,
      filterable: false,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'lastName',
      headerName: '系統代碼名稱',
      flex: 2,
      filterable: false,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'age',
      headerName: '啟用狀態',
      flex: 2,
      filterable: false,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: 'center',
    },
  ];

  const rows = [
    { id: 60, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];
  const pageSizeConfig: number[] = [5, 10];
  const paginationModel = { page: 0, pageSize: 5 };
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
  return (
    <Paper sx={{ height: '100%', width: '100%', gap: 3, mt: 1 }}>
      <p>搜尋</p>
        <SearchForm />
      <Box sx={{ p: 1, gap: 1, display: 'flex' }}>
        <Button variant="outlined" color="info">
          搜尋
        </Button>
        <Button variant="outlined" color="error">
          刪除
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={tableColumns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={pageSizeConfig}
        checkboxSelection
        disableColumnFilter
        localeText={CustomLocaleText}
      />

      <DialogComponent
        open={openDialog}
        onClose={handleDialogClose}
        title={dialogTitle}
        componentType={dialogType}
        comfirmBtn={false}
      />
    </Paper>
  );
}

export default Home;
