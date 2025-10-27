import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";
import type { AlertColor } from "@mui/material";

interface ToastContextType {
    showToast: (message: string, severity?: AlertColor) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("info");

    const showToast = (message: string, severity: AlertColor = "info") => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
    };

    const hideToast = () => {
        setOpen(false);
    };

    // Listen for custom toast events
    React.useEffect(() => {
        const handleToastEvent = (event: CustomEvent) => {
            const { message, severity } = event.detail;
            showToast(message, severity);
        };

        window.addEventListener("showToast", handleToastEvent as EventListener);

        return () => {
            window.removeEventListener(
                "showToast",
                handleToastEvent as EventListener
            );
        };
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={hideToast}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={hideToast}
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
