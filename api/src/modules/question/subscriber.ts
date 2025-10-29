import {EventSubscriber} from 'typeorm';
import {BaseCascadeSubscriber} from "@/modules/base/subscriber";
import {QuestionEntity} from "@/modules/question/entity";
import {AnswerEntity} from "@/modules/answer/entity";

@EventSubscriber()
export class QuestionSubscriber extends BaseCascadeSubscriber<QuestionEntity> {
    constructor() {
        super([
            {childEntity: AnswerEntity, foreignKey: "question_id"}
        ]);
    }

    listenTo() {
        return QuestionEntity;
    }
}