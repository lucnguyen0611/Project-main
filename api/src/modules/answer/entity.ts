import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import {BaseEntity} from "@/modules/base/entity";
import {QuestionEntity} from "@/modules/question/entity";
import {ExamResultEntity} from "@/modules/exam_result/entity";

@Entity('answer')
export class AnswerEntity extends BaseEntity {
    @Column()
    exam_result_id: number;

    @ManyToOne(()=> ExamResultEntity)
    @JoinColumn({ name: 'exam_result_id' })
    exam_result: ExamResultEntity

    @Column()
    question_id: number;

    @ManyToOne(()=> QuestionEntity)
    @JoinColumn({ name: 'question_id' })
    question: QuestionEntity;

    @Column()
    answer: string;

    @Column({
        type: 'boolean',
        array: true,
        nullable: true,
        default: null,
    })
    is_correct: boolean[] | null;

}