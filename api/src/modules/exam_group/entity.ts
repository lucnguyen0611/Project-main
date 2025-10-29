import {BaseEntity} from '@/modules/base/entity';
import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import {ClassEntity} from "@/modules/class/entity";

@Entity('exam_group')
export class ExamGroupEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    class_id: number;

    @Column({
        type: 'timestamp',
    })
    start_time: Date;

    @Column()
    await_time: number;

    @Column()
    is_once: boolean;

    @Column()
    is_save_local: boolean;

    @ManyToOne(() => ClassEntity)
    @JoinColumn({name: 'class_id'})
    class: ClassEntity;
}
