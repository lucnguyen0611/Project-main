// import React, { lazy, Suspense } from "react";
import React, { Suspense } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
    Outlet,
} from "react-router-dom";
import { ROUTES, PATH_SEGMENTS } from "@/constants/routes";
import { AuthProvider, ToastProvider, ExamFlowProvider } from "@/contexts";

// Layouts
import { AuthLayout, ClassMainLayout } from "@/layouts";

// Common Components
import LoadingScreen from "@/components/common/LoadingScreen";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import NotFoundPage from "@/pages/NotFoundPage";

// Auth Guards
// import { PrivateRoute, TeacherRoute, StudentRoute } from "./RouteGuards";
import { PrivateRoute, TeacherRoute } from "./RouteGuards";


// Direct imports for debugging
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import Invite from "@/pages/invite/index.tsx";
import ClassListPage from "@/pages/class/ClassListPage";
import CreateClassPage from "@/pages/class/CreateClassPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import CreatExamPage from "@/pages/exam/CreatExamPage";
import MemberPage from "@/pages/member/MemberPage"
import ExamGroupPage from "@/pages/exam/ExamGroupPage"
// import ExamStudentPage from "@/pages/exam/ExamStudentPage.tsx"
// import ExamPage from "@/pages/exam/ExamPage"
import ExamRoleWapper from "@/pages/exam/ExamRoleWapper"
import StudentDoExamPage from "@/pages/exam/StudentDoExamPage"
import ClassOverviewPage from "@/pages/class/ClassOverviewPage"
import MarkingPage from "@/pages/marking/MarkingPage"


/**
 * Wraps a component with Suspense for lazy loading
 * @param Component The page component to render
 */
const LazyComponent = ({
    component: Component,
}: {
    component: React.ComponentType;
}) => (
    <Suspense fallback={<LoadingScreen />}>
        <Component />
    </Suspense>
);

// Wrap app providers under Router context so hooks like useNavigate work
const ProvidersWrapper: React.FC = () => (
    <ToastProvider>
        <AuthProvider>
            <ExamFlowProvider>
                <Outlet />
            </ExamFlowProvider>
        </AuthProvider>
    </ToastProvider>
);

/**
 * Creates the application router configuration
 */
const router = createBrowserRouter([
    {
        element: <ProvidersWrapper />,
        children: [
            // Root redirect
            {
                path: ROUTES.HOME,
                element: <Navigate to={ROUTES.CLASS_LIST} replace />,
            },

            // Auth routes (public)
            {
                path: PATH_SEGMENTS.AUTH,
                element: <AuthLayout />,
                errorElement: <ErrorBoundary />,
                children: [
                    {
                        path: PATH_SEGMENTS.LOGIN,
                        element: <LoginPage />,
                    },
                    {
                        path: PATH_SEGMENTS.REGISTER,
                        element: <RegisterPage />,
                    },
                ],
            },

            // Protected routes
            {
                element: <PrivateRoute />,
                errorElement: <ErrorBoundary />,
                children: [
                    // Dashboard redirect to classes
                    {
                        path: PATH_SEGMENTS.DASHBOARD,
                        element: <Navigate to={ROUTES.CLASS_LIST} replace />,
                    },

                    // Profile route
                    {
                        path: PATH_SEGMENTS.PROFILE,
                        element: <LazyComponent component={ProfilePage} />,
                    },
                    // Classes routes
                    {
                        path: PATH_SEGMENTS.CLASSES,
                        element: <LazyComponent component={ClassListPage} />,
                    },
                    {
                        path: ROUTES.CLASS_DETAIL,
                        element: <ClassMainLayout />,
                        children: [
                            {
                                index: true,
                                element: <ClassOverviewPage />, // /class/:classId
                            },
                            {
                                path: "exam",
                                element: <ExamGroupPage />,
                            },
                            {
                                path: "exam/:examGroupId", // /class/:classId/members
                                element: <ExamRoleWapper />,
                            },
                            {
                                path: "exam/:examGroupId/create",
                                element: <CreatExamPage mode="create" />,
                            },
                            {
                                path: ":exam/:examGroupId/:examDetailId/edit",
                                element: <CreatExamPage mode="edit" />,
                            },
                            {
                                path: "members",
                                element: <MemberPage />,
                            },
                            {
                                path: ":exam/:examGroupId/markingStudent/:studentId",
                                element: <MarkingPage />,
                            },
                        ],
                    },
                    {
                        path: "/class/:classId/exam/:examGroupId/doing/:examDetailId",
                        element: <LazyComponent component={StudentDoExamPage} />,
                    },
                    {
                        path: 'invite/:classId',
                        element: <LazyComponent component={Invite} />,
                    },
                    {
                        path: PATH_SEGMENTS.CLASS_ADD,
                        element: <TeacherRoute />,
                        children: [
                            {
                                index: true,
                                element: (
                                    <LazyComponent
                                        component={CreateClassPage}
                                    />
                                ),
                            },
                        ],
                    },
                    // Default redirect for any protected route without specific path
                    {
                        index: true,
                        element: <Navigate to={ROUTES.CLASS_LIST} replace />,
                    },
                ],
            },

            // 404 - Not Found
            {
                path: PATH_SEGMENTS.WILDCARD,
                element: <NotFoundPage />,
            },
        ],
    },
]);

/**
 * Main routing component for the application
 */
const AppRoutes: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
