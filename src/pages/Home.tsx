import React, { useState, useRef, type MouseEvent, useEffect } from 'react';
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
import type { ComponentType } from '../interface/ComponentType';
import { initialFormData, type SearchRequest } from '../interface/SearchRequest';
import type { DeleteRequest } from '../interface/DeleteRequest';
import type { EmployeeData } from '../interface/Data';
import { useTranslation } from 'react-i18next';
import { getCustomLocaleText } from '../constants/CustomLocaleText';
//回傳資料型別
interface DataRow {
    employeeId?: string;
    employeeName?: string;
    departmentId?: string;
    status?: string;
    startDate?: string;
}
function Home() {
    const { t, i18n } = useTranslation(); // i18n initial

    const [language, setLanguage] = useState(i18n.language); // i18n狀態
    const [rows, setRows] = useState<DataRow[]>([]); // 顯示在DataGrid的內容狀態
    const [selectedIds, setSelectedIds] = useState<DeleteRequest[]>([]); // 用於批次刪除的checkbox狀態
    const [openDialog, setOpenDialog] = useState(false); // 是否開始彈窗狀態
    const [dialogType, setDialogType] = useState<ComponentType>(null); // 設定彈窗類型(如明細、新增、更新等)
    const [dialogTitle, setDialogTitle] = useState('');// 設定彈窗標題
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });
    const [selectedRowData, setSelectedRowData] = useState<EmployeeData | null>(null); // 設定事件處理訊息
    const [loading, setLoading] = useState(false);// 設定事件處裡過場動作
    const lastSearchRef = useRef<SearchRequest | null>(null); // 取得最後一次搜尋後的狀態，用來確保更新、新增、刪除後原搜尋狀態維持住
    // PageLoad時帶空參數查詢顯示所有Datas
    useEffect(() => {
        handleSearch(initialFormData);
    }, []);
    //設定loading樣式，故意每0.5秒才結束
    const withLoading = async (asyncFn: () => Promise<void>) => {
        setLoading(true);
        const delay = new Promise(resolve => setTimeout(resolve, 500));
        try {
            await Promise.all([asyncFn(), delay]);
        } finally {
            setLoading(false);
        }
    };
    //設定i18n更換語言後的操作
    const changeLanguage = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        await withLoading(async () => {
            const selectedLang = e.target.value;
            i18n.changeLanguage(selectedLang);
            setLanguage(selectedLang);

            // 全域設定 axios 的 Accept-Language header
            axios.defaults.headers.common['Accept-Language'] = selectedLang;
        });
    };
    //當新增時打開空白彈窗(EmployeeForm組件)
    const onOpenInsertModal = async (event: MouseEvent, type: ComponentType) => {
        event.stopPropagation();
        setDialogType(type);
        setDialogTitle(t('createNew'));
        setOpenDialog(true);
    };
    //打axios取的資料後打開明細or更新彈窗(EmployeeForm組件)
    const onOpenDetailModal = async (id: GridRowId, event: MouseEvent, type: ComponentType) => {
        event.stopPropagation();

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
    //處理是否關閉彈窗，除了按x與取消外，新增與更新必須回傳true才會關掉
    const handleDialogClose = async (confirmed: boolean, data?: EmployeeData) => {
        if (confirmed && data) {
            const success = (dialogType === 'Edit') ? await handleUpdate(data) : await handleInsert(data);
            if (!success) {
                return;
            }
        }
        setOpenDialog(false);
    };
    //處理axios回傳錯誤訊息
    const errorMsg = (err: unknown) => {
        if (axios.isAxiosError(err)) {
            const message = err.response?.data?.message || t('errorOccurred');
            setSnackbar({ open: true, message: message, severity: 'error' });
        }
    };
    //處理新增axios
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
    //處理更新axios
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
    //處理刪除axios
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
    //處理查詢axios
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
    //處理查詢(明細)axios
    const handleSearchEmployeeInfo = async (values: SearchRequest): Promise<EmployeeData | null> => {
        try {
            //使用QueryString包參數
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
            setSnackbar({ open: true, message: t('detailLoadSuccess'), severity: 'success' });
            return resultData;
        } catch (err) {
            errorMsg(err);
            return null;
        }
    };
    //MUI DataGrid
    const tableColumns: GridColDef[] = [
        {
            field: 'employeeId',
            headerName: t('detail'),
            flex: 2,
            filterable: false,
            disableColumnMenu: true,
            sortable: false,
            //自訂儲存格內容
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
            {/* 處理i18n語言選擇 */}
            <select value={language} onChange={changeLanguage} style={{ marginBottom: 16 }}>
                <option value="zh">中文</option>
                <option value="en">English</option>
            </select>
            {/* 處理搜尋欄位與新增、批次刪除、清除 */}
            <SearchForm
                onSearch={handleSearch}
                onDelete={handleDelete}
                onInsert={(e) => onOpenInsertModal(e, 'Create')}
                t={t}
            />
            {/* 處理搜尋結果、明細按鍵、更新按鍵 */}
            <DataGrid
                rows={rows}
                columns={tableColumns}
                getRowId={row => row.employeeId as string}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                disableColumnFilter
                localeText={getCustomLocaleText(t)}
                loading={loading}
                onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => {
                    const ids = Array.from((newSelection as any).ids ?? []) as string[];
                    const deleteRequests: DeleteRequest[] = ids.map(id => ({ employeeId: id }));
                    setSelectedIds(deleteRequests);
                }}
            />
            {/* 處理Dialog彈窗，包含明細、新增、更新 */}
            <DialogComponent
                open={openDialog}
                onClose={handleDialogClose}
                title={dialogTitle}
                componentType={dialogType}
                data={selectedRowData}
                maxWidth="xl"
                t={t}
            />
            {/* 處理事件觸發後訊息產生 */}
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
            {/* loading樣式 */}
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Paper>
    );
}

export default Home;
