import {BaseService} from "@/modules/base/service";
import {ClassEntity} from "@/modules/class/entity";
import type {ClassI, ClassResI, ClassReqI, ClassServiceI, ClassUserServiceI} from "@/shares";
import {ClassEntityRepository, ClassUserServiceToken, Role} from "@/shares";
import {Inject, Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {ClsService} from "nestjs-cls";
import {HttpException, HttpStatus} from "@nestjs/common";
import {ClassUserEntity} from "@/modules/class_user/entity";
import {UserEntity} from "@/modules/user/entity";
import {Transactional} from "typeorm-transactional";

@Injectable()
export class ClassService extends BaseService<ClassEntity, ClassReqI, ClassResI>
    implements ClassServiceI {
    constructor(
        @Inject(ClassEntityRepository)
        protected readonly repository: Repository<ClassEntity>,
        protected readonly cls: ClsService,
        @Inject(ClassUserServiceToken)
        private readonly classUserService: ClassUserServiceI,
    ) {
        super(repository, cls);
    }

    protected handleSelect() {
        return this.repository
            .createQueryBuilder(this.getTableName())
            .select([
                'class.id::int as id',
                'class.name as name',
                'class.code as code',
                `coalesce(
                    json_agg(
                        json_build_object(
                            'id', "user".id,
                            'name', "user".name,
                            'role', "user".role,
                            'email', "user".email
                        )
                    ) filter (where "user".role = 'teacher'),
                 '[]') as teachers, 
                    
                 coalesce(
                    json_agg(
                        json_build_object(
                            'id', "user".id,
                            'name', "user".name,
                            'role', "user".role,
                            'email', "user".email
                        )
                    ) filter (where "user".role = 'student'),
                 '[]') as students
                `
            ])
            .innerJoin(ClassUserEntity, 'class_user', 'class_user.class_id = class.id and class_user.active')
            .innerJoin(UserEntity, 'user', '"user".id = class_user.user_id and "user".active')
            .groupBy('class.id, class.name, class.code');
    }

    async find(condition = {}) {
        const curUserId: number | null = this.getAuthenticatedUserId();
        const userRole: Role | null = this.getAuthenticatedRole();
        if (!curUserId || !userRole) throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        let query = this.handleSelect();
        query = this.handleWhere(query, {...condition, active: true});

        if (userRole !== Role.ADMIN) {
            query = query.andWhere(qb => {
                const subQuery = qb.subQuery()
                    .select('class_user_2.class_id')
                    .from(ClassUserEntity, 'class_user_2')
                    .where('class_user_2.user_id = :user_id', {user_id: curUserId});
                return 'class.id in ' + subQuery.getQuery();
            });
        }

        return await query.getRawMany();
    }

    async findOne(id: number){
        const response = await this.find({id});
        if(!response || !Array.isArray(response) || response.length === 0)
            throw new HttpException('Class not found', HttpStatus.NOT_FOUND);
        return response[0];
    }

    @Transactional()
    async createAndJoinClass(classReq: ClassReqI): Promise<ClassI> {
        const creatorId = this.getAuthenticatedUserId();
        const newClass = await this.create(classReq);
        if (!creatorId || !newClass)
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);

        // automatically add the creator (teacher) to the class
        await this.classUserService.create({
            class_id: newClass.id,
            user_id: creatorId
        })

        const {id, name, code} = newClass;
        return {id, name, code};
    }

    async updateOne(id: number, classReq: ClassReqI): Promise<ClassResI> {
        const userId: number | null = this.getAuthenticatedUserId();
        const userRole: Role | null = this.getAuthenticatedRole();
        if (!userId || !userRole)
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);

        // only teachers of the class and admin can find then update
        const classToUpdate = await this.findOne(id);

        return await super.updateOne(id, classReq);
    }

    async softDelete(id: number){
        const userId: number | null = this.getAuthenticatedUserId();
        const userRole: Role | null = this.getAuthenticatedRole();
        if (!userId || !userRole)
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);

        // only teachers of the class or the admin can find then delete the class
        const classToDelete = await this.findOne(id);

        return await super.softDelete(id);
    }

}