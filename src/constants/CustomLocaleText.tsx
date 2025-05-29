import type { GridLocaleText } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

// 處理pagination bar
export const getCustomLocaleText = (t: ReturnType<typeof useTranslation>['t']): Partial<GridLocaleText> => ({
    paginationRowsPerPage: t('rowsPerPage'),
    paginationDisplayedRows: ({ from, to, count }) =>
        t('paginationDisplayedRows', { from, to, count }),
    footerTotalVisibleRows: (visibleCount, totalCount) =>
        t('footerTotalVisibleRows', { visibleCount, totalCount }),
    footerRowSelected: count =>
        t('footerRowSelected', { count }),
});
