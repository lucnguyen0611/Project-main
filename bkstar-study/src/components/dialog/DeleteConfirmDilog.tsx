// src/components/common/DeleteConfirmDialog.tsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

export interface DeleteConfirmDialogProps {
    open: boolean;
    title?: string;
    description?: string | React.ReactNode;
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
                                                                     open,
                                                                     title = "Xác nhận xóa",
                                                                     description = "Bạn có chắc chắn muốn xóa mục này?",
                                                                     loading = false,
                                                                     onClose,
                                                                     onConfirm,
                                                                 }) => {
    const handleConfirm = async () => {
        await onConfirm();
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="delete-confirm-title">
            <DialogTitle id="delete-confirm-title">{title}</DialogTitle>

            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    HỦY
                </Button>
                <Button
                    color="error"
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading ? "Đang xóa..." : "Xác nhận"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmDialog;
