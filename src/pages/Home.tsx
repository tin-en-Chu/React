import React, { useState, useRef, type MouseEvent } from 'react';
import axios from 'axios';
import qs from 'qs';
import {
    Box,
    Button,
    Paper,
    Snackbar,
    Alert,
    Backdrop,
    CircularProgress,
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
import type { DeleteRequest } from '../interface/DeleteRequest';
import type { EmployeeData } from '../components/EmployeeForm';

import { useTranslation } from 'react-i18next';

interface DataRow {
    employeeId?: string;
    employeeName?: string;
    departmentId?: string;
    status?: string;
    startDate?: string;
}

function Home() {
    const { t, i18n } = useTranslation();

    const [language, setLanguage] = useState(i18n.language);
    const [rows, setRows] = useState<DataRow[]>([]);
    const [selectedIds, setSelectedIds] = useState<DeleteRequest[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<ComponentType>(null);
    const [dialogTitle, setDialogTitle] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });
    const [selectedRowData, setSelectedRowData] = useState<EmployeeData | null>(null);
    const [loading, setLoading] = useState(false);
    const lastSearchRef = useRef<SearchRequest | null>(null);

    const withLoading = async (asyncFn: () => Promise<void>) => {
        setLoading(true);
        const delay = new Promise(resolve => setTimeout(resolve, 500));
        try {
            await Promise.all([asyncFn(), delay]);
        } finally {
            setLoading(false);
        }
    };

    const stopPropagation = (event: MouseEvent) => {
        event.stopPropagation();
    };

    const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLang = e.target.value;
        console.log(selectedLang)
        i18n.changeLanguage(selectedLang);
        setLanguage(selectedLang);
    };

    const handleSearchEmployeeInfo = async (values: SearchRequest): Promise<EmployeeData | null> => {
        try {
            const queryString = qs.stringify(values, { skipNulls: true });
            const response = await axios.get(`http://localhost:8099/Employee/getDetail?${queryString}`);
            const result = response.data.datas;
            const resultData: EmployeeData = {
                employeeId: result.employeeId || '',
                employeeName: result.employeeName || '',
                departmentId: result.departmentId || '',
                gender: result.gender || '',
                birth: result.birth || '',
                email: result.email || '',
                startDate: result.startDate || '',
                phone: result.phone || '',
                modifyBy: result.modifyBy || '',
                modifyDate: result.modifyDate || '',
                status: result.status || ''
            };
            setSnackbar({ open: true, message: t('detail') + ' ' + t('successInsert'), severity: 'success' });
            return resultData;
        } catch (err) {
            errorMsg(err);
            return null;
        }
    };

    const onOpenInsertModal = async (event: MouseEvent, type: ComponentType) => {
        stopPropagation(event);
        setSelectedRowData(null); // 新增時清空表單資料stopPropagation(event);
        setDialogType(type);
        setDialogTitle(t('createNew'));
        setOpenDialog(true);
    };

    const onOpenDetailModal = async (id: GridRowId, event: MouseEvent, type: ComponentType) => {
        stopPropagation(event);

        const reqId: SearchRequest = {
            employeeId: String(id),
        };

        const detail = await handleSearchEmployeeInfo(reqId);
        if (detail) {
            setSelectedRowData(detail);
            setDialogType(type);
            setDialogTitle(type === 'Detail' ? t('detail') : t('edit'));
            setOpenDialog(true);
        }
    };

    const handleDialogClose = async (confirmed: boolean, data?: EmployeeData) => {
        if (confirmed && data) {
            let success = false;

            if (dialogType === 'Edit') {
                success = await handleUpdate(data);
            } else if (dialogType === 'Create') {
                success = await handleInsert(data);
            }

            if (success) {
                setOpenDialog(false);
            }
        } else {
            setOpenDialog(false);
        }
    };

    const errorMsg = (err: unknown) => {
        if (axios.isAxiosError(err)) {
            const message = err.response?.data?.message || t('errorOccurred');
            setSnackbar({ open: true, message: message, severity: 'error' });
        }
    };

    const handleInsert = async (data: EmployeeData): Promise<boolean> => {
        try {
            await axios.post('http://localhost:8099/Employee/insertResult', data);
            setSnackbar({ open: true, message: t('successInsert'), severity: 'success' });

            if (lastSearchRef.current) {
                await handleSearch(lastSearchRef.current);
            }
            return true;
        } catch (err) {
            errorMsg(err);
            return false;
        }
    };

    const handleUpdate = async (data: EmployeeData): Promise<boolean> => {
        try {
            await withLoading(async () => {
                await axios.put('http://localhost:8099/Employee/updateResult', data);
                setSnackbar({ open: true, message: t('successUpdate'), severity: 'success' });
            });
            if (lastSearchRef.current) {
                await handleSearch(lastSearchRef.current);
            }
            return true;
        } catch (err) {
            errorMsg(err);
            return false;
        }
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            setSnackbar({ open: true, message: t('pleaseSelectDelete'), severity: 'error' });
            return;
        }

        await withLoading(async () => {
            try {
                await axios.delete('http://localhost:8099/Employee/deleteResultByBatch', {
                    data: selectedIds,
                });
                setSnackbar({ open: true, message: t('successDelete'), severity: 'success' });

                if (lastSearchRef.current) {
                    await handleSearch(lastSearchRef.current);
                }
                setSelectedIds([]);
            } catch (err) {
                errorMsg(err);
            }
        });
    };

    const handleSearch = async (values: SearchRequest) => {
        await withLoading(async () => {
            try {
                lastSearchRef.current = values;
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
            } catch (err) {
                setRows([]);
                errorMsg(err);
            }
        });
    };

    const tableColumns: GridColDef[] = [
        {
            field: 'employeeId',
            headerName: t('detail'),
            flex: 2,
            filterable: false,
            disableColumnMenu: true,
            sortable: false,
            renderCell: params => (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                    <Button variant="outlined" color="info" onClick={e => onOpenDetailModal(params.id, e, 'Detail')}>
                        {t('detail')}
                    </Button>
                    <Button variant="outlined" color="info" onClick={e => onOpenDetailModal(params.id, e, 'Edit')}>
                        {t('edit')}
                    </Button>
                </Box>
            ),
            headerAlign: 'center',
        },
        {
            field: 'employeeName',
            headerName: t('employeeName'),
            flex: 2,
            headerAlign: 'center',
        },
        {
            field: 'startDate',
            headerName: t('startDate'),
            flex: 2,
            headerAlign: 'center',
        },
        {
            field: 'status',
            headerName: t('status'),
            flex: 2,
            headerAlign: 'center',
        },
        {
            field: 'departmentId',
            headerName: t('departmentId'),
            flex: 2,
            headerAlign: 'center',
        },
    ];

    return (
        <Paper sx={{ height: '100%', width: '100%', gap: 3, mt: 1, p: 2 }}>
            {/* 語言選擇 */}
            <select value={language} onChange={changeLanguage} style={{ marginBottom: 16 }}>
                <option value="zh">中文</option>
                <option value="en">English</option>
            </select>

            <SearchForm
                onSearch={handleSearch}
                onDelete={handleDelete}
                onInsert={(e) => onOpenInsertModal(e, 'Create')}
                t={t}
            />

            <DataGrid
                rows={rows}
                columns={tableColumns}
                getRowId={row => row.employeeId as string}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                disableColumnFilter
                localeText={CustomLocaleText}
                loading={loading}
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
                data={selectedRowData}
                maxWidth="xl"
                t={t}
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

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Paper>
    );
}

export default Home;
