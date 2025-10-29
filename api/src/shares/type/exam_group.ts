interface ExamGroupBaseI {
    name: string;
    class_id: number;
    start_time: Date;
    await_time: number;
    is_once: boolean;
    is_save_local: boolean;
}

export interface ExamGroupI extends ExamGroupBaseI {
    id: number;
}

export type ExamGroupReqI = ExamGroupBaseI;

export type ExamGroupResI = ExamGroupI;
