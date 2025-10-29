import {QuestionReqI, QuestionResI} from '@/shares';

interface ExamBaseI {
    exam_group_id: number;
    name: string;
    code: string;
    number_of_question: number;
    total_time: number;
    description: string;
}

export interface ExamI extends ExamBaseI {
    id: number;
    questions: QuestionResI[];
    file_id: number;
}

export interface ExamReqI extends ExamBaseI {
    questions: QuestionReqI[];
}

export interface ExamResI extends Omit<ExamI, 'file_id'> {
    file: {
        id: number;
        url: string;
        file_type: string;
    }
}
