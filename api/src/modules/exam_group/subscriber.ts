import {EventSubscriber} from "typeorm";
import {BaseCascadeSubscriber} from "@/modules/base/subscriber";
import {ExamGroupEntity} from "@/modules/exam_group/entity";
import {ExamEntity} from "@/modules/exam/entity";

@EventSubscriber()
export class ExamGroupSubscriber extends BaseCascadeSubscriber<ExamGroupEntity> {
    constructor() {
        super([
            {childEntity: ExamEntity, foreignKey: "exam_group_id"}
        ]);
    }

    listenTo() {
        return ExamGroupEntity;
    }
}