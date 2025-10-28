export interface ExamFileI{
    id: number | null,
    url?: string,
    file_type?: string
}

export interface Answer{
    questionId: number,
    questionIndex: number,
    questionType: string,
    answer: string
}

export interface Action {
    type: string,
    payload?: any
}

export interface ExamDoing{
    examName: string,
    examCode: string,
    file: ExamFileI,
    questions: Answer[],
    timeLeft: number,
    device: string
}

export interface ApiExamAnswer {
    id: number;
    question: number;
    index: number;
    answer: string;          // ví dụ: "A" | "A,B" | "q" (long-response)
    is_correct: boolean[];   // mảng boolean tương ứng (multi-choice có nhiều phần tử)
    type: string;
}

export interface ApiExamResult {
    id: number;
    exam_id: number;
    user_id: number;
    device: string | null;
    created_at: string;               // ISO timestamp
    answers: ApiExamAnswer[];         // mảng câu trả lời
    number_of_question: number;
    number_of_correct_answer: number;
    old_answer: any | null;
    score: number | null;
    status: string;                   // ví dụ "doing", "finished", ...
}

export interface ExamAnswer {
    id: number;
    questionId: number;
    index: number;
    answer: string;
    isCorrect: boolean[];
    type: string;
    // thêm extras nếu backend trả thêm
    [key: string]: any;
}

export interface ExamResult {
    id: number;
    exam: number;
    user: number;
    device: string | null;
    createdAt: string;               // ISO timestamp
    answers: ExamAnswer[];
    number_of_question: number;
    number_of_correct_answer: number;
    old_answer: any | null;
    score: number | null;
    status: string;
    [key: string]: any;
}

export interface CreateExamResultQuestion {
    question_id: number;   // id câu hỏi
    answer: string;     // câu trả lời (chuỗi), trống nếu chưa trả lời
}

export interface CreateExamResultRequest {
    device: string; // "desktop" | "mobile" | ...
    exam_id: number | string;
    user_id: number | string;
    status: string; // "doing" | "finished" | ...
    questions: CreateExamResultQuestion[];
}

export interface UpdateExamResultQuestion {
    question_id: number;   // id câu hỏi
    answer: string;     // câu trả lời (chuỗi), trống nếu chưa trả lời
    id: number;
    is_correct: boolean[] | null;
}

export interface UpdateExamResultRequest {
    device: string; // "desktop" | "mobile" | ...
    exam_id: number | string;
    user_id: number | string;
    status: string; // "doing" | "finished" | ...
    questions: UpdateExamResultQuestion[];
}

