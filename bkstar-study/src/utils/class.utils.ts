import type { Class, ClassUser } from "@/types/class.types";

/**
 * Lấy số thành viên đã xác nhận trong lớp
 */
export const getConfirmedMemberCount = (classData: Class): number => {
    if (!classData.users || !Array.isArray(classData.users)) {
        return 0;
    }
    return classData.users.filter((user) => user.status === "confirming").length;
};

/**
 * Lấy danh sách teacher trong lớp
 */
export const getTeachers = (classData: Class): ClassUser[] => {
    if (!classData.users || !Array.isArray(classData.users)) {
        return [];
    }
    return classData.users.filter((user) => user.role === "teacher");
};

/**
 * Lấy danh sách student trong lớp
 */
export const getStudents = (classData: Class): ClassUser[] => {
    if (!classData.users || !Array.isArray(classData.users)) {
        return [];
    }
    return classData.users.filter((user) => user.role === "student");
};

/**
 * Kiểm tra xem user có phải là teacher của lớp không
 */
export const isTeacherOfClass = (classData: Class, userId: number): boolean => {
    if (!classData.users || !Array.isArray(classData.users)) {
        return false;
    }
    return classData.users.some(
        (user) =>
            user.id === userId &&
            user.role === "teacher" &&
            user.status === "confirming"
    );
};

/**
 * Kiểm tra xem user có phải là student của lớp không
 */
export const isStudentOfClass = (classData: Class, userId: number): boolean => {
    if (!classData.users || !Array.isArray(classData.users)) {
        return false;
    }
    return classData.users.some(
        (user) =>
            user.id === userId &&
            user.role === "student" &&
            user.status === "confirming"
    );
};
