import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts";
import { ROUTES } from "@/constants/routes";
import LoadingScreen from "@/components/common/LoadingScreen";

/**
 * Private route guard - requires authentication
 */
export const PrivateRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <Outlet />;
};

/**
 * Teacher route guard - requires teacher or admin role
 */
export const TeacherRoute: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // Redirect to classes if user doesn't have teacher/admin role
    if (user?.role !== "teacher" && user?.role !== "admin") {
        return <Navigate to={ROUTES.CLASS_LIST} replace />;
    }

    return <Outlet />;
};

/**
 * Student route guard - requires student role
 */
export const StudentRoute: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // Redirect to classes if user doesn't have student role
    if (user?.role !== "student") {
        return <Navigate to={ROUTES.CLASS_LIST} replace />;
    }

    return <Outlet />;
};

/**
 * Admin route guard - requires admin role
 */
export const AdminRoute: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // Redirect to classes if user doesn't have admin role
    if (user?.role !== "admin") {
        return <Navigate to={ROUTES.CLASS_LIST} replace />;
    }

    return <Outlet />;
};
