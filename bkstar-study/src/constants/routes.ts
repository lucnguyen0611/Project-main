export const ROUTES = {
    // Auth routes
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",

    // Main routes
    HOME: "/",
    DASHBOARD: "/classes",

    // Class routes
    CLASSES: "/classes",
    CLASS_LIST: "/classes",
    CLASS_DETAIL: "/class/:classId",
    CLASS_ADD: "/class/add",
    CLASS_JOIN: "/class/join/:inviteCode",
    CLASS_MEMBERS: "/class/:classId/members",
    CLASS_EXAMS: "/class/:classId/exams",

    // Exam routes
    EXAMS: "/class/exams",
    EXAM_CREATE: "/exams/create",
    EXAM_DETAIL: "/exams/:examId",
    EXAM_QUESTIONS: "/exams/:examId/questions",
    EXAM_TAKE: "/exams/:examId/take",
    EXAM_RESULTS: "/exams/:examId/results",
    EXAM_ADD_QUESTION: "/exams/:examId/questions/add",

    // User routes
    PROFILE: "/profile",
    USER_PROFILE: "/user/profile",
    SETTINGS: "/user/settings",
    USER_MANAGEMENT: "/user/management",
} as const;

// Path segments for router configuration
export const PATH_SEGMENTS = {
    // Auth segments
    AUTH: "auth",
    LOGIN: "login",
    REGISTER: "register",

    // Main segments
    DASHBOARD: "dashboard",
    PROFILE: "profile",

    // Class segments
    CLASSES: "classes",
    CLASS: "class",
    CLASS_ADD: "class/add",

    // Wildcard
    WILDCARD: "*",
} as const;
