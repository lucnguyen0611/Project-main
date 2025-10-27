import { DataSource } from 'typeorm';
import { DATA_SOURCE } from "@/shares";
import {PasswordResetTokenEntity} from "@/modules/password_reset_token/entity";
import {UserEntity} from "@/modules/user/entity";
import {FileEntity} from "@/modules/file/entity";
import {ClassEntity} from "@/modules/class/entity";
import {ClassUserEntity} from "@/modules/class_user/entity";
import {ClassSubscriber} from "@/modules/class/subscriber";
import {UserSubscriber} from "@/modules/user/subscriber";
import {ExamGroupEntity} from "@/modules/exam_group/entity";
import {QuestionEntity} from "@/modules/question/entity";
import {ExamEntity} from "@/modules/exam/entity";
import { addTransactionalDataSource } from 'typeorm-transactional';
import {ExamGroupSubscriber} from "@/modules/exam_group/subscriber";
import {ExamSubscriber} from "@/modules/exam/subscriber";
import {AnswerEntity} from "@/modules/answer/entity";
import {ExamResultEntity} from "@/modules/exam_result/entity";
import {ExamResultSubscriber} from "@/modules/exam_result/subscriber";
import {QuestionSubscriber} from "@/modules/question/subscriber";

export const databaseProviders = [
    {
        provide: DATA_SOURCE,
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: 'db',
                port: 5432,
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                entities: [
                    UserEntity,
                    PasswordResetTokenEntity,
                    FileEntity,
                    ClassEntity,
                    ClassUserEntity,
                    ExamGroupEntity,
                    QuestionEntity,
                    ExamEntity,
                    AnswerEntity,
                    ExamResultEntity,
                ],
                subscribers: [
                    UserSubscriber,
                    ClassSubscriber,
                    ExamGroupSubscriber,
                    ExamSubscriber,
                    ExamResultSubscriber,
                    QuestionSubscriber,
                ],
                synchronize: true,
            });

            await dataSource.initialize();

            addTransactionalDataSource(dataSource);

            return dataSource;
        },
    },
];
