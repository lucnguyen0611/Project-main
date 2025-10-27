import {Injectable, Inject, InternalServerErrorException} from '@nestjs/common';
import {BaseService} from "@/modules/base/service";
import {ExamResultEntity} from "@/modules/exam_result/entity";
import {ExamResultEntityRepository, AnswerServiceToken, AnswerReqI, AnswerResI, ExamResultServiceI} from "@/shares";
import {
    InsertQueryBuilder,
    InsertResult,
    Repository,
    UpdateQueryBuilder,
    UpdateResult
} from "typeorm";
import {ClsService} from "nestjs-cls";
import type {AnswerServiceI, ExamResultReqI, ExamResultResI} from "@/shares";
import {Transactional} from "typeorm-transactional";

@Injectable()
export class ExamResultService extends BaseService<ExamResultEntity, ExamResultReqI, ExamResultResI>
implements ExamResultServiceI
{
    constructor(
        @Inject(ExamResultEntityRepository)
        protected repository: Repository<ExamResultEntity>,
        protected cls: ClsService,
        @Inject(AnswerServiceToken)
        private readonly answerService: AnswerServiceI,
    ) {
        super(repository, cls);
    }

    protected getPublicColumns(): string[] {
        return super.getPublicColumns().concat(['created_at']);
    }

    // cannot be sure this is still ExamResultEntity, so use any
    async findAndFilter(userId: number, examGroupId: number) {
        const query = this.repository
            .createQueryBuilder(this.getTableName())
            .select('er.id::int','id')
            .addSelect('er.exam_id::int','exam_id')
            .addSelect('er.user_id::int','user_id')
            .addSelect('er.status','status')
            .addSelect('er.device','device')
            .addSelect('er.number_of_correct_answer','number_of_correct_answer')
            .addSelect('er.score','score')
            .addSelect('er.created_at','created_at')
            .addSelect( subQuery => {
                return subQuery
                    .select('COUNT(*)::int')
                    .from('answer', 'a')
                    .where('a.exam_result_id = er.id')
                    .andWhere('a.active')
            },'number_of_question')
            .addSelect( subQuery => {
                return subQuery
                    .select(`
                        COALESCE(
                            JSON_AGG(
                                JSON_BUILD_OBJECT(
                                    'id', a.id,
                                    'question_id', a.question_id,
                                    'index', q.index,
                                    'type', q.type,
                                    'answer', a.answer,
                                    'is_correct', a.is_correct
                                )                      
                        ), '[]')
                    `).from('answer', 'a')
                    .leftJoin('question', 'q', 'q.id = a.question_id')
                    .where('a.exam_result_id = er.id')
                    .andWhere('a.active')
                    .andWhere('q.active');
            }, 'answers')
            .from('exam_result', 'er')
            .innerJoin('exam', 'e', 'e.id = er.exam_id')
            .where('e.exam_group_id = :examGroupId', {examGroupId})
            .andWhere('er.user_id = :userId', {userId})
            .andWhere('er.active')
            .andWhere('e.active')
            .groupBy('er.id, er.exam_id, er.user_id, er.status, er.device, er.number_of_correct_answer, er.score, er.created_at');

        return await query.getRawMany();
    }

    @Transactional()
    async create(examResultReq: ExamResultReqI): Promise<ExamResultResI> {
        const userId: number | null = this.getAuthenticatedUserId();
        const {questions, ...rest} = examResultReq;

        // create an exam result with temp data first to receive the id
        const tempExamResultData = {...rest, created_by: userId};
        const query: InsertQueryBuilder<ExamResultEntity> = this.repository
            .createQueryBuilder(this.getTableName())
            .insert()
            .values(tempExamResultData)
            .returning(this.getPublicColumns());
        const response: InsertResult = await query.execute();

        if(!response || !Array.isArray(response.raw) || response.raw.length === 0) {
            throw new InternalServerErrorException('Failed to create new record');
        }
        const examResultId: number = response.raw[0].id;

        // add examResultId to answers and create answers
        const answersWithExamResultId: AnswerReqI[] = questions.map(q => ({
            ...q,
            exam_result_id: examResultId,
        }))
        const newAnswers: AnswerResI[] = await Promise.all(answersWithExamResultId
            .map(q => this.answerService.create(q)));

        // calculate number_of_correct_answer and update to the record
        const number_of_correct_answer: number = this.countCorrectAnswer(newAnswers);

        const queryToUpdate: UpdateQueryBuilder<ExamResultEntity> = this.repository
            .createQueryBuilder(this.getTableName())
            .update()
            .set({number_of_correct_answer})
            .where('id = :id and active = :active', {id: examResultId, active: true})
            .returning(this.getPublicColumns());

        const result: UpdateResult = await queryToUpdate.execute();

        if(!result || !Array.isArray(result.raw) || result.raw.length === 0) {
            throw new InternalServerErrorException('Failed to update exam result with answers');
        }
        const number_of_question: number = newAnswers.length;

        return {...result.raw[0], answers: newAnswers, number_of_question } as ExamResultResI;
    }

    @Transactional()
    async updateOne(id: number, examResultReq: ExamResultReqI): Promise<ExamResultResI> {
        const userId: number | null = this.getAuthenticatedUserId();
        const {questions: updatingQuestions, ...rest} = examResultReq;

        const updatedQuestions: AnswerResI[] = await this.answerService.updateMany(updatingQuestions);
        const number_of_correct_answer: number = this.countCorrectAnswer(updatedQuestions);

        const query: UpdateQueryBuilder<ExamResultEntity> = this.repository
            .createQueryBuilder(this.getTableName())
            .update()
            .set({...rest, updated_by: userId, number_of_correct_answer})
            .where('id = :id and active = :active', {id, active: true})
            .returning(this.getPublicColumns());
        const response: UpdateResult = await query.execute();

        if(!response || !Array.isArray(response.raw) || response.raw.length === 0) {
            throw new InternalServerErrorException('Failed to update exam result with answers');
        }
        const number_of_question: number = updatedQuestions.length;

        return {...response.raw[0], answers: updatedQuestions, number_of_question } as ExamResultResI;

    }

    private countCorrectAnswer(answers: AnswerResI[]): number {
        let correctAnswer: number = 0;
        for(const answer of answers){
            const isCorrect: boolean[] | null = answer.is_correct;
            if(!isCorrect || isCorrect.includes(false)) continue;
            correctAnswer++;
        }
        return correctAnswer;
    }
}