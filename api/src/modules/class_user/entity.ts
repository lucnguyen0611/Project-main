import {BaseEntity} from "@/modules/base/entity";
import {Entity, Column, ManyToOne, JoinColumn} from "typeorm";
import {ClassEntity} from "@/modules/class/entity";
import {UserEntity} from "@/modules/user/entity";

@Entity('class_user')
export class ClassUserEntity extends BaseEntity {
    @Column({
        name: 'class_id',
    })
    class_id: number;

    @Column({
        name: 'user_id',
    })
    user_id: number;

    @ManyToOne(() => ClassEntity)
    @JoinColumn({ name: 'class_id' })
    class: ClassEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}