import React from "react";
import ExamPage from "./ExamPage";
import ExamStudentPage from "./ExamStudentPage";
import { useAuth } from "@/contexts"; // hook để lấy thông tin user hiện tại

const ExamRoleWrapper: React.FC = () => {
    const { isTeacher } = useAuth(); // ví dụ user = { role: "teacher" | "student" }

    if (isTeacher) {
        return <ExamPage />;
    }

    return <ExamStudentPage />;
};

export default ExamRoleWrapper;
