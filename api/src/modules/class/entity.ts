import {BaseEntity} from "@/modules/base/entity";
import {Entity, Column, OneToMany} from "typeorm";
import {ClassUserEntity} from "@/modules/class_user/entity";

@Entity('class')
export class ClassEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    code: string;

    @OneToMany(() => ClassUserEntity, classUser => classUser.class)
    classUsers: ClassUserEntity[];
}