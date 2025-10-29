import { DataSource } from 'typeorm';
import { UserEntity } from './modules/user/entity';
import { PasswordResetTokenEntity } from './modules/password_reset_token/entity';
import { FileEntity } from './modules/file/entity';
import { ClassEntity } from './modules/class/entity';
import { ClassUserEntity } from './modules/class_user/entity';
import { ExamGroupEntity } from './modules/exam_group/entity';
import { QuestionEntity } from './modules/question/entity';
import { ExamEntity } from './modules/exam/entity';
import { AnswerEntity } from './modules/answer/entity';
import { ExamResultEntity } from './modules/exam_result/entity';
import { UserSubscriber } from './modules/user/subscriber';
import { ClassSubscriber } from './modules/class/subscriber';
import { ExamGroupSubscriber } from './modules/exam_group/subscriber';
import { ExamSubscriber } from './modules/exam/subscriber';
import { ExamResultSubscriber } from './modules/exam_result/subscriber';
import { QuestionSubscriber } from './modules/question/subscriber';

// This is used by TypeORM CLI only (migrations)
// Not used for runtime of NestJS

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'default',
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
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
