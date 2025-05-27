import { useState, useRef, type MouseEvent } from 'react';
import axios from 'axios';
import qs from 'qs';
import {
    Box,
    Button,
    Paper,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    DataGrid,
    type GridRowId,
    type GridColDef,
    type GridRowSelectionModel,
} from '@mui/x-data-grid';

import SearchForm from '../components/SearchForm';
import DialogComponent from '../components/DialogComponent';
import { CustomLocaleText } from '../constants/CustomLocaleText';

import type { ComponentType } from '../interface/ComponentType';
import type { SearchRequest } from '../interface/SearchRequest';

interface DataRow {
    employeeId?: string;
    employeeName?: string;
    departmentId?: string;
    status?: string;
    startDate?: string;
}

interface DeleteRequest {
    employeeId: string;
}

function Home() {
    const [rows, setRows] = useState<DataRow[]>([]);
    const [selectedIds, setSelectedIds] = useState<DeleteRequest[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<ComponentType>('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const lastSearchRef = useRef<SearchRequest | null>(null); // 儲存上一次搜尋條件

    const stopPropagation = (event: MouseEvent) => {
        event.stopPropagation();
    };

    const onOpenDetailModal = (id: GridRowId, event: MouseEvent, type: ComponentType) => {
        stopPropagation(event);
        setOpenDialog(true);
        setDialogType(type);
        setDialogTitle(type === 'Detail' ? '查看詳情' : '編輯資料');
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            setSnackbar({ open: true, message: '請先勾選要刪除的項目', severity: 'error' });
            return;
        }

        try {
            await axios.delete('http://localhost:8099/Employee/deleteResultByBatch', {
                data: selectedIds,
            });
            setSnackbar({ open: true, message: '刪除成功', severity: 'success' });

            // 刪除後重新查詢資料
            if (lastSearchRef.current) {
                await handleSearch(lastSearchRef.current);
            }
            setSelectedIds([]);
        } catch (error) {
            console.error('刪除失敗', error);
            setSnackbar({ open: true, message: '刪除失敗', severity: 'error' });
        }
    };

    const handleSearch = async (values: SearchRequest) => {
        try {
            lastSearchRef.current = values; // 儲存目前搜尋條件
            const queryString = qs.stringify(values, { skipNulls: true });
            const response = await axios.get(`http://localhost:8099/Employee/getResult?${queryString}`);
            const result = response.data;

            const formattedRows: DataRow[] = result.datas.map((item: any) => ({
                employeeId: item.employeeId,
                employeeName: item.employeeName ?? '',
                startDate: item.startDate ?? '',
                status: item.status ?? '',
                departmentId: item.departmentId ?? '',
            }));

            setRows(formattedRows);
        } catch (error) {
            setRows([]);
            setSnackbar({ open: true, message: '搜尋完成', severity: 'success' });
        }
    };

    const tableColumns: GridColDef[] = [
        {
            field: 'employeeId',
            headerName: '操作功能',
            flex: 2,
            filterable: false,
            disableColumnMenu: true,
            sortable: false,
            renderCell: params => (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                    <Button variant="outlined" color="info" onClick={e => onOpenDetailModal(params.id, e, 'Detail')}>
                        明細
                    </Button>
                    <Button variant="outlined" color="info" onClick={e => onOpenDetailModal(params.id, e, 'Edit')}>
                        編輯
                    </Button>
                </Box>
            ),
            headerAlign: 'center',
        },
        {
            field: 'employeeName',
            headerName: '員工姓名',
            flex: 2,
            headerAlign: 'center',
        },
        {
            field: 'startDate',
            headerName: '入職日期',
            flex: 2,
            headerAlign: 'center',
        },
        {
            field: 'status',
            headerName: '啟用狀態',
            flex: 2,
            headerAlign: 'center',
        },
        {
            field: 'departmentId',
            headerName: '所屬部門代碼',
            flex: 2,
            headerAlign: 'center',
        },
    ];

    return (
        <Paper sx={{ height: '100%', width: '100%', gap: 3, mt: 1, p: 2 }}>
            <SearchForm onSearch={handleSearch} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <Button variant="contained" color="error" onClick={handleDelete}>
                    批次刪除
                </Button>
            </Box>
            <DataGrid
                rows={rows}
                columns={tableColumns}
                getRowId={row => row.employeeId as string}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                disableColumnFilter
                localeText={CustomLocaleText}
                onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => {
                    const ids = Array.from((newSelection as any).ids ?? []) as string[];
                    const deleteRequests: DeleteRequest[] = ids.map(id => ({ employeeId: id }));
                    setSelectedIds(deleteRequests);
                }}
            />
            <DialogComponent
                open={openDialog}
                onClose={handleDialogClose}
                title={dialogTitle}
                componentType={dialogType}
                comfirmBtn={false}
            />
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
}

export default Home;
