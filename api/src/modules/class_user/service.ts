import {BaseService} from "@/modules/base/service";
import {ClassUserEntity} from "@/modules/class_user/entity";
import {Inject, Injectable} from "@nestjs/common";
import {ClassUserEntityRepository} from "@/shares";
import type {ClassUserI, ClassUserReqI, ClassUserServiceI} from "@/shares";
import {Repository} from "typeorm";
import {ClsService} from "nestjs-cls";

@Injectable()
export class ClassUserService extends BaseService<ClassUserEntity, ClassUserReqI, ClassUserI>
    implements ClassUserServiceI {
    constructor(
        @Inject(ClassUserEntityRepository)
        protected repository: Repository<ClassUserEntity>,
        protected cls: ClsService,
    ) {
        super(repository, cls);
    }
}