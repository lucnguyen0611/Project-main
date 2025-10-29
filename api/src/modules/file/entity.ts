import {BaseEntity} from '@/modules/base/entity';
import {Entity, Column, OneToOne, JoinColumn} from "typeorm";
import {UserEntity} from "@/modules/user/entity";
import {ExamEntity} from "@/modules/exam/entity";

@Entity('file')
export class FileEntity extends BaseEntity {
    @Column({
        name: 'public_id',
        unique: true
    })
    public_id: string;

    @Column({
        unique: true
    })
    url: string;

    @Column({
        name: 'viewable_url',
        nullable: true
    })
    viewable_url: string;

    @Column({
        name: 'original_name'
    })
    original_name: string;

    @Column({
        name: 'file_type',
        type: 'varchar',
        length: 50
    })
    file_type: string;

    @Column()
    size: number;

    @OneToOne(() => UserEntity, user => user.file)
    user: UserEntity;

    @OneToOne(() => ExamEntity, exam => exam.file)
    exam: ExamEntity;
}