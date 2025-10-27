import {AnswerReqI, AnswerResI} from "@/shares/type/answer";

interface ExamResultBaseI {
    user_id: number;
    exam_id: number;
    status: string;
    device: string;
}

export interface ExamResultI extends ExamResultBaseI {
    id: number;
    answers: AnswerResI[];
    number_of_correct_answer: number;
    score: number | null;
}

export interface ExamResultReqI extends ExamResultBaseI {
    questions: AnswerReqI[];
}

export interface ExamResultResI extends ExamResultI {
    number_of_question: number;
    created_at: Date;
}
