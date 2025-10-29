import {Entity, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import {BaseEntity} from "@/modules/base/entity";
import {UserEntity} from "@/modules/user/entity";
import {ExamEntity} from "@/modules/exam/entity";
import {AnswerEntity} from "@/modules/answer/entity";

@Entity('exam_result')
export class ExamResultEntity extends BaseEntity {
    @Column()
    user_id: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: 'user_id'})
    user: UserEntity;

    @Column()
    exam_id: number;

    @ManyToOne(() => ExamEntity)
    @JoinColumn({name: 'exam_id'})
    exam: ExamEntity;

    @Column()
    status: string;

    @Column()
    device: string;

    @OneToMany(() => AnswerEntity, answer => answer.exam_result)
    answers: AnswerEntity[];

    @Column({default: 0})
    number_of_correct_answer: number;

    @Column({type: 'float', nullable: true, default: null})
    score: number | null;
}