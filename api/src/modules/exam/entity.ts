import { BaseEntity } from '@/modules/base/entity';
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from 'typeorm';
import {QuestionEntity} from "@/modules/question/entity";
import {ExamGroupEntity} from "@/modules/exam_group/entity";
import {FileEntity} from "@/modules/file/entity";

@Entity('exam')
export class ExamEntity extends BaseEntity {
    @Column()
    exam_group_id: number;

    @ManyToOne(()=> ExamGroupEntity)
    @JoinColumn({ name: 'exam_group_id' })
    exam_group: ExamGroupEntity;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    number_of_question: number;

    @Column()
    total_time: number;

    @Column()
    description: string;

    @OneToMany(()=> QuestionEntity, question => question.exam)
    questions: QuestionEntity[];

    @Column()
    file_id: number;

    @OneToOne(()=> FileEntity, file => file.exam)
    @JoinColumn({ name: 'file_id' })
    file: FileEntity;
}
