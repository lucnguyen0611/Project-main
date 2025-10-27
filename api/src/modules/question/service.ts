import {Inject, Injectable, InternalServerErrorException} from '@nestjs/common';
import {BaseService} from "@/modules/base/service";
import {QuestionEntity} from "@/modules/question/entity";
import {QuestionResI, QuestionReqI, QuestionServiceI, QuestionType} from "@/shares";
import {QuestionEntityRepository} from "@/shares";
import {InsertQueryBuilder, InsertResult, Repository} from "typeorm";
import {ClsService} from "nestjs-cls";
import {Transactional} from "typeorm-transactional";

@Injectable()
export class QuestionService extends BaseService<QuestionEntity, QuestionReqI, QuestionResI>
implements QuestionServiceI{
    constructor(
        @Inject(QuestionEntityRepository)
        protected repository: Repository<QuestionEntity>,
        protected cls: ClsService,
    ) {
        super(repository, cls);
    }

    @Transactional()
    async createMany(questions: QuestionReqI[]){
        const userId: number | null = this.getAuthenticatedUserId();

        if (!questions || questions.length === 0) {
            return [];
        }

        const questionsWithUserId = questions.map((question)=> ({
            ...question,
            created_by: userId,
        }))

        const query: InsertQueryBuilder<QuestionEntity> = this.repository
            .createQueryBuilder(this.getTableName())
            .insert()
            .values(questionsWithUserId)
            .returning(this.getPublicColumns());

        const response: InsertResult = await query.execute();
        if(!response || !Array.isArray(response.raw) || response.raw.length === 0){
            throw new InternalServerErrorException('Failed to create new questions');
        }

        const cleanedResult = response.raw.map((q) => ({
            id: q.id,
            index: q.index,
            type: q.type,
            correct_answer: q.correct_answer
        }))
        return cleanedResult as QuestionResI[];
    }

    @Transactional()
    async updateMany(questions: QuestionReqI[]){
        const userId: number | null = this.getAuthenticatedUserId();

        if(!questions || questions.length === 0) return [];

        const questionsData: string = questions.map((q)=>
            `(${q.id},${q.index},'${q.type}'::question_type_enum,'${q.correct_answer}',${q.exam_id},${userId})`
        ).join(',');

        const query =
            `
                WITH questions_to_update(id, index, type, correct_answer, exam_id, updated_by) AS (
                    VALUES ${questionsData}
                )
                UPDATE "${this.getTableName()}" AS q
                SET
                    "index" = qtu.index,
                    "type" = qtu.type,
                    "correct_answer" = qtu.correct_answer,
                    "updated_by" = qtu.updated_by
                    FROM questions_to_update AS qtu
                WHERE q.id = qtu.id
                RETURNING q.id, q.index, q.type, q.correct_answer;
            `
        const result = await this.repository.query(query);
        if(!result || result.length === 0) throw new InternalServerErrorException('Failed to update questions');
        return result[0] as QuestionResI[];
    }

}