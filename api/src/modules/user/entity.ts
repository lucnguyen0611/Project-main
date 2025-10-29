import {BaseEntity} from '@/modules/base/entity';
import {Column, Entity, JoinColumn, OneToMany, OneToOne} from 'typeorm';
import {Role} from '@/shares';
import {ClassUserEntity} from "@/modules/class_user/entity";
import {FileEntity} from "@/modules/file/entity";

@Entity('user')
export class UserEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    status: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.STUDENT,
    })
    role: Role;

    @Column()
    password: string;

    @Column({type: 'varchar', nullable: true})
    school: string | null;

    @Column({type: 'varchar', nullable: true})
    parent_name: string | null;

    @Column({type: 'varchar', nullable: true})
    parent_phone: string | null;

    @Column({nullable: true})
    avatar: number | null;

    @OneToMany(() => ClassUserEntity, classUser => classUser.user)
    classUsers: ClassUserEntity[];

    @OneToOne(() => FileEntity, file => file.user)
    @JoinColumn({name: 'avatar'})
    file: FileEntity;
}
