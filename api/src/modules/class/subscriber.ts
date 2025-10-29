import {
    EventSubscriber,
} from 'typeorm';
import {ClassEntity} from '@/modules/class/entity';
import {ClassUserEntity} from '@/modules/class_user/entity';
import {ExamGroupEntity} from "@/modules/exam_group/entity";
import {BaseCascadeSubscriber} from "@/modules/base/subscriber";

@EventSubscriber()
export class ClassSubscriber extends BaseCascadeSubscriber<ClassEntity> {
    constructor() {
        super([
            {childEntity: ClassUserEntity, foreignKey: "class_id"},
            {childEntity: ExamGroupEntity, foreignKey: "class_id"},
        ]);
    }

    listenTo() {
        return ClassEntity;
    }
}