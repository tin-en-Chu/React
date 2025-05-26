import type { GridLocaleText } from '@mui/x-data-grid';

// 客製化分頁器顯示欄位
export const CustomLocaleText: Partial<GridLocaleText> = {
  paginationRowsPerPage: '每頁筆數',
  paginationDisplayedRows: ({ from, to, count }) => `第 ${from} 到 ${to} 筆，共 ${count} 筆`,
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `顯示 ${visibleCount} / 共 ${totalCount} 筆`,
  footerRowSelected: count => `已選擇 ${count} 筆`,
};
