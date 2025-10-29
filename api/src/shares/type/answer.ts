import {QuestionType} from "@/shares";

interface AnswerBaseI {
    question_id: number;
    answer: string;
}

export interface AnswerI extends AnswerBaseI {
    id: number;
    is_correct: boolean[] | null;
}

export interface AnswerReqI extends AnswerBaseI {
    id?: number;
    is_correct?: boolean[] | null;
    exam_result_id?: number;
}

export interface AnswerResI extends AnswerI {
    index?: number;
    type?: QuestionType;
}
