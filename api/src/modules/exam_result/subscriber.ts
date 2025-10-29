import {EventSubscriber} from "typeorm";
import {BaseCascadeSubscriber} from "@/modules/base/subscriber";
import {ExamResultEntity} from "@/modules/exam_result/entity";
import {AnswerEntity} from "@/modules/answer/entity";

@EventSubscriber()
export class ExamResultSubscriber extends BaseCascadeSubscriber<ExamResultEntity> {
    constructor() {
        super([
            {childEntity: AnswerEntity, foreignKey: "exam_result_id"}
        ])
    }
}