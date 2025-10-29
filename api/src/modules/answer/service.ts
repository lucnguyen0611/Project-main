import {Inject, Injectable, InternalServerErrorException} from '@nestjs/common';
import {BaseService} from "@/modules/base/service";
import {AnswerEntity} from "@/modules/answer/entity";
import type {AnswerReqI, AnswerResI, AnswerServiceI, QuestionServiceI} from "@/shares";
import {AnswerEntityRepository, QuestionResI, QuestionServiceToken, QuestionType} from "@/shares";
import {Repository} from "typeorm";
import {ClsService} from "nestjs-cls";
import {Transactional} from "typeorm-transactional";

@Injectable()
export class AnswerService extends BaseService<AnswerEntity, AnswerReqI, AnswerResI>
    implements AnswerServiceI {
    constructor(
        @Inject(AnswerEntityRepository)
        protected repository: Repository<AnswerEntity>,
        protected cls: ClsService,
        @Inject(QuestionServiceToken)
        private readonly questionService: QuestionServiceI,
    ) {
        super(repository, cls);
    }

    async create(answerReq: AnswerReqI): Promise<AnswerResI> {
        const {question_id, answer} = answerReq;

        const question: QuestionResI = await this.questionService.findOne(question_id);
        const {type: questionType, correct_answer} = question;

        let isCorrect: boolean[] | null;
        // if the question's type is long-response, initially assign is_correct as null to remark later
        // for single-choice and multiple-choice questions: empty answers would be marked as false,
        // otherwise compare the answer to correct_answer to determine the isCorrect array
        if (questionType === QuestionType.LONG_RESPONSE) {
            isCorrect = null;
        } else if (answer === '') {
            isCorrect = [false];
        } else {
            const arrayOfCorrectAnswers: string[] = correct_answer.split(',');
            const arrayOfAnswers: string[] = answer.split(',');
            isCorrect = arrayOfAnswers.map((a) => arrayOfCorrectAnswers.includes(a));
        }

        const data = {...answerReq, is_correct: isCorrect};
        return await super.create(data)
    }

    @Transactional()
    async updateMany(answers: AnswerReqI[]): Promise<AnswerResI[]> {
        const userId: number | null = this.getAuthenticatedUserId();
        if (!answers || answers.length === 0) return [];

        const escapeLiteral = (str: string) => str.replace(/'/g, "''");

        const answersData: string = answers.map((a: AnswerReqI) => {
            const {id, question_id, answer, is_correct} = a;

            const pgArray = is_correct
                ? `'{${
                    is_correct.map(val => val ? 'true' : 'false').join(',')
                } }'::boolean[]`
                : `NULL`;

            return `(${id}, ${question_id}, '${escapeLiteral(answer)}', ${pgArray}, ${userId})`;
        }).join(',');


        const query =
            `
                WITH answers_to_update(id, question_id, answer, is_correct, updated_by) AS (
                    VALUES ${answersData}
                )
                UPDATE "${this.getTableName()}" AS a
                SET
                    "is_correct" = atu.is_correct,
                    "updated_by" = atu.updated_by
                    FROM answers_to_update AS atu
                WHERE a.id = atu.id
                RETURNING a.id, a.question_id, a.answer, a.is_correct;
            `
        const result = await this.repository.query(query);
        if (!result || result.length === 0) throw new InternalServerErrorException('Failed to update results');
        return result[0] as AnswerResI[];
    }
}