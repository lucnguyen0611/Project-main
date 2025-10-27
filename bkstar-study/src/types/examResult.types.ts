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
    examFile: ExamFileI,
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
    exam: number;
    user: number;
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
    question: number;   // id câu hỏi
    answer: string;     // câu trả lời (chuỗi), trống nếu chưa trả lời
}

export interface CreateExamResultRequest {
    device: string; // "desktop" | "mobile" | ...
    exam: number | string;
    user: number | string;
    status: string; // "doing" | "finished" | ...
    questions: CreateExamResultQuestion[];
}
