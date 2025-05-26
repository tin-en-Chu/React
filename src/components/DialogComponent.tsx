import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  type DialogProps as MuiDialogProps,
} from '@mui/material';
import type { ComponentType } from '../interface/ComponentType';

interface DialogProps {
  open: boolean;
  title?: string;
  cancelBtn?: boolean;
  comfirmBtn?: boolean;
  componentType: ComponentType;
  onClose: (result: boolean) => void;
  maxWidth?: MuiDialogProps['maxWidth']; // 支援 xs, sm, md, lg, xl
}

/**
 *
 *
 * @export
 * @param {DialogProps} {
 *   open,
 *   title = '確認操作',
 *   onClose,
 *   cancelBtn = true,
 *   comfirmBtn = true,
 *   maxWidth = 'sm',
 * }
 * @return {*}
 */
export default function DialogComponent({
  open,
  title = '確認操作',
  onClose,
  componentType = 'Detail',
  cancelBtn = true,
  comfirmBtn = true,
  maxWidth = 'sm',
}: DialogProps) {
  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth={maxWidth} fullWidth>
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          onClick={() => onClose(false)}
          sx={theme => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          {' '}
        </IconButton>
      </DialogTitle>

      <DialogContent></DialogContent>

      <DialogActions>
        {cancelBtn && (
          <Button onClick={() => onClose(false)} color="error">
            取消
          </Button>
        )}
        {comfirmBtn && (
          <Button onClick={() => onClose(true)} variant="contained" color="primary">
            確定
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
