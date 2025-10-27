import {
    EventSubscriber,
} from 'typeorm';
import { UserEntity } from '@/modules/user/entity';
import { ClassUserEntity } from '@/modules/class_user/entity';
import { ExamResultEntity } from '@/modules/exam_result/entity';
import { BaseCascadeSubscriber } from "@/modules/base/subscriber";

@EventSubscriber()
export class UserSubscriber extends BaseCascadeSubscriber<UserEntity> {
    constructor() {
        super([
            { childEntity: ClassUserEntity, foreignKey: "user_id" },
            { childEntity: ExamResultEntity, foreignKey: "user_id"}
        ]);
    }

    listenTo() {
        return UserEntity;
    }
}