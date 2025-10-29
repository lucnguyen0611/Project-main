import {Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {BaseService} from "@/modules/base/service";
import {ExamEntity} from "@/modules/exam/entity";
import type {ExamResI, ExamReqI, ExamServiceI, QuestionServiceI, QuestionReqI, QuestionResI} from "@/shares";
import {ExamEntityRepository, QuestionServiceToken} from "@/shares";
import {QuestionType} from "@/shares";
import {
    InsertQueryBuilder,
    InsertResult,
    Repository,
    SelectQueryBuilder,
    UpdateQueryBuilder,
    UpdateResult
} from "typeorm";
import {ClsService} from "nestjs-cls";
import {QuestionEntity} from "@/modules/question/entity";
import {Transactional} from "typeorm-transactional";

@Injectable()
export class ExamService extends BaseService<ExamEntity, ExamReqI, ExamResI>
    implements ExamServiceI {
    constructor(
        @Inject(ExamEntityRepository)
        protected repository: Repository<ExamEntity>,
        protected cls: ClsService,
        @Inject(QuestionServiceToken)
        private readonly questionService: QuestionServiceI,
    ) {
        super(repository, cls);
    }

    @Transactional()
    async create(examReq: ExamReqI): Promise<ExamResI> {
        const creatorId: number | null = this.getAuthenticatedUserId();
        const {questions, ...rest} = examReq;

        // create an exam with temp data first to receive the exam id
        const tempExamData = {...rest, created_by: creatorId};
        const query: InsertQueryBuilder<ExamEntity> = this.repository
            .createQueryBuilder(this.getTableName())
            .insert()
            .values(tempExamData)
            .returning(this.getPublicColumns());
        const response: InsertResult = await query.execute();

        if (!response || !Array.isArray(response.raw) || response.raw.length === 0) {
            throw new Error('Failed to create new record');
        }
        const examId: number = response.raw[0].id;

        // add exam_id to questions and create questions
        const questionsWithExamId: QuestionReqI[] = questions.map((question) => ({
            ...question,
            exam_id: examId,
            type: question.type as QuestionType
        }));
        const newQuestions: QuestionResI[] = await this.questionService.createMany(questionsWithExamId);

        return {...response.raw[0], questions: newQuestions} as ExamResI;
    }

    @Transactional()
    async updateOne(id: number, examReq: ExamReqI): Promise<ExamResI> {
        const curExam: ExamResI = await this.findOne(id);
        if (!curExam) throw new NotFoundException('Exam not found');
        const curQuestions: QuestionResI[] = curExam.questions;

        const userId: number | null = this.getAuthenticatedUserId();
        const {questions: newQuestions, ...rest} = examReq;

        // question to create are those from payload without ids
        const questionsWithoutIds: QuestionReqI[] = newQuestions.filter(q => !q.id);
        const questionsToCreate: QuestionReqI[] = questionsWithoutIds.map(q => ({
            ...q,
            exam_id: id,
            type: q.type as QuestionType,
        }));

        // questions to update are those from payload with ids
        const questionsWithIds: QuestionReqI[] = newQuestions.filter(q => q.id);
        const questionsToUpdate: QuestionReqI[] = questionsWithIds.map(q => ({
            ...q,
            exam_id: id,
            type: q.type as QuestionType,
        }));

        // questions to delete are those with ids exist in the database but not in the payload
        const idsInPayload = questionsToUpdate.map(q => q.id);
        const questionIdsToDelete = curQuestions
            .filter(q => !idsInPayload.includes(q.id))
            .map(q => q.id) as number[];

        // operations to update questions for the exam
        let updatedExamQuestions: QuestionResI[] = [];
        try {
            const deletePromises = questionIdsToDelete.map((id: number) =>
                this.questionService.softDelete(id)
            );

            const [createdQuestions, updateQuestions, _deleteResults] = await Promise.all([
                this.questionService.createMany(questionsToCreate),
                this.questionService.updateMany(questionsToUpdate),
                Promise.all(deletePromises)
            ]);

            updatedExamQuestions = [...createdQuestions, ...updateQuestions];

            const query: UpdateQueryBuilder<ExamEntity> = this.repository
                .createQueryBuilder(this.getTableName())
                .update()
                .set({...rest, updated_by: userId})
                .where('id = :id and active = :active', {id, active: true})
                .returning(this.getPublicColumns());

            const response: UpdateResult = await query.execute();
            if (!response || !Array.isArray(response.raw) || response.raw.length === 0)
                throw new InternalServerErrorException('Failed to update exam with questions');
            return {...response.raw[0], questions: updatedExamQuestions} as ExamResI;

        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    protected handleSelect(): SelectQueryBuilder<ExamEntity> {
        return this.repository
            .createQueryBuilder(this.getTableName())
            .select([
                'exam.id as id',
                'exam.exam_group_id::int as exam_group_id',
                'exam.name as name',
                'exam.code as code',
                'exam.total_time as total_time',
                'exam.number_of_question as number_of_question',
                'exam.description as description',
                `coalesce(
                    json_agg(
                        json_build_object(
                            'id', question.id,
                            'index', question.index,
                            'type', question.type,
                            'correct_answer', question.correct_answer
                        )
                    ) filter (where question.active = true),
                '[]') as questions   
                `,
                `json_build_object('id', exam_file.id, 'url', exam_file.viewable_url, 'file_type', exam_file.file_type)
                as file`
            ])
            .leftJoin(QuestionEntity, 'question', 'question.exam_id = exam.id and question.active = true')
            .leftJoin('exam.file', 'exam_file')
            .groupBy('exam.id, exam.exam_group_id, exam.name, exam.code, exam.total_time, exam.number_of_question, exam.description, exam_file.id');
    }

}
