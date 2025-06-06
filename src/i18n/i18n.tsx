import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            insert: "Insert",
            delete: "Delete",
            detail: "Detail",
            detailLoadSuccess: "Detail Loaded Success",
            clear: "Clear",
            edit: "Edit",
            startDate: "Start Date",
            status: "Status",
            on:"On",
            off:"Off",
            departmentId: "Department ID",
            search: "Search",
            reset: "Reset",
            createNew: "Create New",
            confirmDelete: "Confirm Delete",
            cancel: "Cancel",
            confirm: "Confirm",
            successInsert: "Insert successful",
            successUpdate: "Update successful",
            successDelete: "Delete successful",
            errorOccurred: "An error occurred",
            pleaseSelectDelete: "Please select items to delete",
            batchDelete : "BatchDelete",
            keyword:"Keyword",
            searchPeriod :"SearchPeriod",
            start:"Start",
            end:"End",
            department:"Depart",
            allDepartments:"All",
            departmentHr:"HR",
            departmentIt:"IT",
            departmentFinance:"Finance",
            departmentOperations:"Operation",
            employeeId:"Id",
            employeeName: "Name",
            employeebirth:"Birth",
            employeeEmail:"Email",
            employeeDepartment:"Department",
            employeeStatus:"Status",
            employeeGender:"Gender",
            employeeStartDate:"StartDate",
            employeePhone:"Phone",
            employeeModifyBy:"ModifyBy",
            employeeModifyDate:"ModifyDate",
            genderMale:"Male",
            genderFemale:"Female",
            rowsPerPage: "Rows per page",
            paginationDisplayedRows: "{{from}}–{{to}} of {{count}}",
            footerTotalVisibleRows: "{{visibleCount}} of {{totalCount}} total",
            footerRowSelected: "{{count}} selected"
        },
    },
    zh: {
        translation: {
            insert: "新增",
            delete: "刪除",
            detail: "明細",
            detailLoadSuccess: "明細加載成功",
            clear: "清除",
            edit: "編輯",
            startDate: "入職日期",
            status: "啟用狀態",
            on:"開",
            off:"關",
            departmentId: "所屬部門代碼",
            search: "搜尋",
            reset: "重置",
            createNew: "新增資料",
            confirmDelete: "確認刪除",
            cancel: "取消",
            confirm: "確認",
            successInsert: "新增成功",
            successUpdate: "更新成功",
            successDelete: "刪除成功",
            errorOccurred: "發生錯誤",
            pleaseSelectDelete: "請先勾選要刪除的項目",
            batchDelete : "批次刪除",
            allDepartments:"全部",
            keyword:"關鍵字",
            searchPeriod :"搜尋時間",
            start:"開始時間",
            end:"結束時間",
            department:"部門",
            departmentHr:"人資部",
            departmentIt:"工程部",
            departmentFinance:"財務部",
            departmentOperations:"營運部",
            employeeId:"員工編號",
            employeeName: "員工姓名",
            employeebirth:"生日",
            employeeEmail:"信箱",
            employeeDepartment:"部門",
            employeeStatus:"狀態",
            employeeGender:"性別",
            employeeStartDate:"入職日",
            employeePhone:"手機號碼",
            employeeModifyBy:"修改人",
            employeeModifyDate:"修改日期",
            genderMale:"男",
            genderFemale:"女",
            rowsPerPage: "每頁筆數",
            paginationDisplayedRows: "第 {{from}} 到 {{to}} 筆，共 {{count}} 筆",
            footerTotalVisibleRows: "顯示 {{visibleCount}} / 共 {{totalCount}} 筆",
            footerRowSelected: "已選擇 {{count}} 筆"
        },
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'zh',
        fallbackLng: 'zh',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
