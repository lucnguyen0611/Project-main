export enum QuestionType {
    SINGLE_CHOICE = 'single-choice',
    MULTIPLE_CHOICE = 'multiple-choice',
    LONG_RESPONSE = 'long-response'
}

interface QuestionBaseI {
    index: number;
    type: QuestionType;
    correct_answer: string;
}

export interface QuestionI extends QuestionBaseI {
    id: number;
    exam_id: number;
}

export interface QuestionReqI extends QuestionBaseI {
    id?: number;
    exam_id?: number;
}

export interface QuestionResI extends Omit<QuestionI, 'exam_id'> {
}
