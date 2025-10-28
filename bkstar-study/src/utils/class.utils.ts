import type { Class } from "@/types/class.types";
import type { Course } from "@/types/user.types";

/**
 * Lấy số thành viên đã xác nhận trong lớp
 */
export const getConfirmedMemberCount = (classData: Class): number => {
    const studentCount = Array.isArray(classData.students)
        ? classData.students.length
        : 0;
    const teacherCount = Array.isArray(classData.teachers)
        ? classData.teachers.length
        : 0;
    return studentCount + teacherCount;
};

/**
 * Lấy danh sách học sinh trong lớp
 */
export const getStudents = (classData: Course) => {
    return Array.isArray(classData.students) ? classData.students : [];
};

/**
 * Lấy danh sách giáo viên trong lớp
 */
export const getTeachers = (classData: Course) => {
    return Array.isArray(classData.teachers) ? classData.teachers : [];
};
