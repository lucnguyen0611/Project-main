import {Inject, Injectable} from "@nestjs/common";
import {BaseService} from "@/modules/base/service";
import {ExamGroupEntity} from "@/modules/exam_group/entity";
import {ExamGroupEntityRepository, ExamGroupI, ExamGroupReqI, ExamGroupServiceI} from "@/shares";
import {Repository} from "typeorm";
import {ClsService} from "nestjs-cls";

@Injectable()
export class ExamGroupService extends BaseService<ExamGroupEntity, ExamGroupReqI, ExamGroupI>
    implements ExamGroupServiceI {
    constructor(
        @Inject(ExamGroupEntityRepository)
        protected repository: Repository<ExamGroupEntity>,
        protected cls: ClsService,
    ) {
        super(repository, cls);
    }

    protected getPublicColumns(): string[] {
        return super.getPublicColumns().concat(['created_at']);
    }
}