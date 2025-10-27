interface User {
    id: number;
    name: string;
    role: string;
    email: string;
    parent_name: string | null;
    parent_phone: string | null;
    school: string | null;
    classes?: ClassInfo[];  // Có thể có danh sách lớp kèm theo user
    avata?: Avatar | null;  // Avatar có thể null
}

// Thông tin avatar
interface Avatar {
    id: number | null;
    url: string | null;
}

// Thông tin lớp học
interface ClassInfo {
    id: number;
    name: string;
    code: string;
}

// Thông tin chính của đối tượng (ví dụ: Employee)
export interface ExamGroup {
    id: number;
    name: string;
    await_time: number;         // tính bằng giây
    clas: number;              // có vẻ là id lớp chính
    created_at: string;        // ISO datetime string
    start_time: string;        // YYYY-MM-DD
    is_once: boolean;
    is_save_local: boolean;
    users: User[];
    classes: ClassInfo[];
}

//
// export interface ExamGroup {
//     id: number;
//     name: string;
//     clas: number;
//     start_time: string;
//     await_time: number;
//     is_once: boolean;
//     is_save_local: boolean;
//     created_at?: string;
//     users: UserClassI[];
// }

export interface Exam{
    id?: number,
    name: string,
    code: string,
    exam_group_id: number,
    number_of_question: number | string,
    total_time: number,
    questions: Question[],
    description: string,
    file: ExamFile | null,
}

export interface ExamFile{
    id: number | null,
    url?: string,
    file_type?: string
}

export interface ExamWithStatus extends Exam{
    status: string
}

export interface CreateEamRequest {
    "name": string,
    "class_id": number,
    "start_time": string,
    "await_time": number,
    "is_once": boolean,
    "is_save_local": boolean
}

export interface CreateExamResponse {
    name: string,
    class_id: number,
    start_time: string,
    await_time: number,
}

export interface Question{
    type: string,
    correct_answer: string,
    index: number,
    id?: number
}

export interface ExamItem {
    id: number;
    name: string;
    code: string;
    exam_group: number; // ID nhóm đề
    total_time: number; // tổng thời gian làm bài (phút)
    correct_answer: Record<string, any>; // nếu là object tùy động
    questions: ExamQuestion[]; // danh sách câu hỏi
    description: string;
    number_of_question: number; // số lượng câu hỏi
    file: ExamFile | null; // file đính kèm (có thể null)
}

export interface ExamQuestion {
    id?: number;
    index: number;
    correct_answer: string;
    type: string; // có thể mở rộng thêm loại khác
}


