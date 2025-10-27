import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import type { AuthState } from "@/types/auth.types";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { getAccessToken, getRememberEmail } from "@/utils/storage.utils";
import { getUserInfoFromToken, isTokenExpired } from "@/utils/jwt.utils";
import { authReducer, initialState } from "./auth.reducer";
import * as authService from "./auth.service";

interface AuthContextType extends AuthState {
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    register: (name: string, email: string, password: string, role: "student" | "teacher") => Promise<void>;
    logout: () => void;
    clearError: () => void;
    getRememberEmail: () => string | null;
    // NOTE: we deliberately do NOT expose a manual refreshAuthToken here
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const navigate = useNavigate();

    const isRoleTeacher = (user: any) => {
        if (!user) return false;
        const role = user?.role;
        return role === "teacher" || role === "admin";
    };

    // On app start: restore session ONLY if access token exists and is valid.
    useEffect(() => {
        const restoreSession = () => {
            try {
                const accessToken = getAccessToken();

                if (accessToken && !isTokenExpired(accessToken)) {
                    const user = getUserInfoFromToken(accessToken);
                    // getRefreshToken intentionally not used here — interceptor will handle refresh
                    if (user) {
                        dispatch({
                            type: "LOGIN_SUCCESS",
                            payload: {
                                user,
                                accessToken,
                                refreshToken: null,
                                isTeacher: isRoleTeacher(user),
                            },
                        });
                        dispatch({ type: "AUTH_CHECK_COMPLETE" });
                        return;
                    }
                }

                // no valid access token -> ensure logged out and redirect to login
                authService.logout();
                dispatch({ type: "LOGOUT" });
                dispatch({ type: "AUTH_CHECK_COMPLETE" });
                navigate(ROUTES.LOGIN, { replace: true });
            } catch (err) {
                authService.logout();
                dispatch({ type: "LOGOUT" });
                dispatch({ type: "AUTH_CHECK_COMPLETE" });
                navigate(ROUTES.LOGIN, { replace: true });
            }
        };

        restoreSession();
    }, [navigate]);

    // Listen for global logout events
    useEffect(() => {
        const handleLogout = () => {
            dispatch({ type: "LOGOUT" });
            authService.logout();
            navigate(ROUTES.LOGIN, { replace: true });
        };
        window.addEventListener("logout", handleLogout);
        return () => window.removeEventListener("logout", handleLogout);
    }, [navigate]);

    // Login
    const login = async (email: string, password: string, rememberMe = false) => {
        try {
            dispatch({ type: "LOGIN_START" });
            const result = await authService.login(email, password, rememberMe);
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: {
                    user: result.user,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    isTeacher: isRoleTeacher(result.user),
                },
            });

            window.dispatchEvent(
                new CustomEvent("showToast", { detail: { message: "Đăng nhập thành công!", severity: "success" } })
            );

            navigate(ROUTES.CLASS_LIST);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Đăng nhập thất bại";
            dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
            throw error;
        }
    };

    // Register
    const register = async (name: string, email: string, password: string, role: "student" | "teacher") => {
        try {
            dispatch({ type: "REGISTER_START" });
            await authService.register(name, email, password, role);
            dispatch({ type: "REGISTER_SUCCESS" });

            window.dispatchEvent(
                new CustomEvent("showToast", { detail: { message: "Đăng ký thành công! Vui lòng đăng nhập.", severity: "success" } })
            );

            setTimeout(() => navigate(ROUTES.LOGIN), 800);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Đăng ký thất bại";
            dispatch({ type: "REGISTER_FAILURE", payload: errorMessage });
            throw error;
        }
    };

    // Logout
    const logout = () => {
        authService.logout();
        dispatch({ type: "LOGOUT" });

        window.dispatchEvent(
            new CustomEvent("showToast", { detail: { message: "Đăng xuất thành công!", severity: "info" } })
        );

        navigate(ROUTES.LOGIN, { replace: true });
    };

    const clearError = () => dispatch({ type: "CLEAR_ERROR" });

    const getRememberEmailFromStorage = () => getRememberEmail();

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        clearError,
        getRememberEmail: getRememberEmailFromStorage,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}