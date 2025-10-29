// src/components/common/DialogContainer.tsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteConfirmDialog from "@/components/dialog/DeleteConfirmDilog.tsx";

export interface DialogProp {
    isLoading: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    onDelete?: () => Promise<void> | void;
    mode?: "create" | "edit";
    width?: number;
    title?: string;
    children?: React.ReactNode;
}

export default function DialogContainer({
                                            isLoading,
                                            isOpen,
                                            onClose,
                                            children,
                                            onSave,
                                            onDelete,
                                            mode = "create",
                                            width = 600,
                                            title = "Dialog",
                                        }: DialogProp) {
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    const handleDeleteConfirm = () => {
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!onDelete) return;
        try {
            setDeleting(true);
            await onDelete(); // gọi API xoá từ parent
            setConfirmOpen(false); // chỉ đóng khi xoá thành công
        } catch (err) {
            console.error("Delete failed:", err);
            // ❗ Không đóng dialog để người dùng biết lỗi, có thể show toast bên ngoài
        } finally {
            setDeleting(false);
        }
    };

    const defaultActions = (
        <>
            {mode === "create" ? (
                <>
                    <Button disabled={isLoading} variant="text" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button disabled={isLoading} variant="contained" onClick={onSave}>
                        Lưu
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        disabled={isLoading}
                        color="error"
                        variant="outlined"
                        onClick={handleDeleteConfirm}
                    >
                        Xóa
                    </Button>
                    <Button disabled={isLoading} variant="contained" onClick={onSave}>
                        Lưu
                    </Button>
                </>
            )}
        </>
    );

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={onClose}
                sx={{ ".MuiDialog-paper": { width: width, maxWidth: "95%" } }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {title}
                    <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Box sx={{ width: "100%" }}>{children}</Box>
                </DialogContent>

                <DialogActions>{defaultActions}</DialogActions>
            </Dialog>

            {/* Reusable delete confirm */}
            <DeleteConfirmDialog
                open={confirmOpen}
                loading={deleting}
                title="Xác nhận xóa"
                description="Bạn có chắc chắn muốn xóa mục này?"
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
