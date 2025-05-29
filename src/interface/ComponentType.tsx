import { Box } from "@mui/material";

export type ComponentType = 'Detail' | 'Edit' | 'Create' | null;
export const LabelBox = ({ label }: { label: string }) => (
    <Box sx={{
        minWidth: 70,
        whiteSpace: 'nowrap',
        fontWeight: 500
    }}
    >
        {label} :
    </Box>
);
export const Label = ({ text }: { text: string }) => (
    <Box
        sx={{
            minWidth: '80px',
            backgroundColor: '#A0522D',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: 14,
            fontWeight: 500,
            whiteSpace: 'nowrap',
        }}
    >
        {text}
    </Box>
);
export const FormRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <Box
        sx={{
            display: 'flex',
            width: 'calc(50% - 8px)',
            minWidth: '400px',
            gap: 1,
            alignItems: 'center',
        }}
    >
        <Label text={label} />
        {children}
    </Box>
);