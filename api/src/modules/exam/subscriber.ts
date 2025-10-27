import {EventSubscriber} from 'typeorm';
import {BaseCascadeSubscriber} from "@/modules/base/subscriber";
import {ExamEntity} from "@/modules/exam/entity";
import {QuestionEntity} from "@/modules/question/entity";
import {ExamResultEntity} from "@/modules/exam_result/entity";

@EventSubscriber()
export class ExamSubscriber extends BaseCascadeSubscriber<ExamEntity> {
    constructor() {
        super([
            {childEntity: QuestionEntity, foreignKey: "exam_id"},
            {childEntity: ExamResultEntity, foreignKey: "exam_id"}
        ]);
    }

    listenTo() {
        return ExamEntity;
    }
}