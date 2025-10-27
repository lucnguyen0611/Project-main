export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "auth/login/",
  REGISTER: "auth/register/",
  REFRESH_TOKEN: "/auth/refresh/",

  // User endpoints
  USER_PROFILE: "/user/profile/",
  UPDATE_PROFILE: "/user/:id",
  CHANGE_PASSWORD: "/user/change_password",

  // Class endpoints
  CLASSES: "/classes/",
  CLASS_DETAIL: "/classes/:id/",
  CLASS_UPDATE: "/classes/:id/",
  CLASS_DELETE: "/classes/:id/",

  // Exam Group endpoints
  EXAMS_GROUP: "/exam_groups/:classesId/",
  EXAM_GROUP_DETAIL: "/exam_groups/:id/",
  EXAM_GROUP_CREATE: "/exam_groups/",
  EXAM_GROUP_UPDATE: "/exam_groups/:id/",
  EXAM_GROUP_DELETE: "/exam_groups/",

  // Exam Detail endpoints
  EXAMS: "/exams/:id",
  EXAM_DETAIL: "/exams/:id/",
  EXAM_CREATE: "/exams/",
  EXAM_UPDATE: "/exams/:id",
  EXAM_DELETE: "/exams/:id/",

  // Exam Result endpoints
  EXAM_RESULT_CREATE: "/exam_results/",
  EXAM_RESULT_UPDATE: "/exam_results/:id",





  EXAM_QUESTIONS: "/exams/:id/questions/",
  EXAM_RESULTS: "/exams/:id/results/",
} as const;

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:3000/api";
