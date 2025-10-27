import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/module';
import {AuthModule} from "@/modules/auth/module";
import {StudentModule} from "@/modules/student/module";
import {TeacherModule} from "@/modules/teacher/module";
import {ClassModule} from "@/modules/class/module";
import {InvitationModule} from "@/modules/invitation/module";

import {ClsModule} from "nestjs-cls";
import {ConfigModule} from "@nestjs/config";
import {ExamGroupModule} from "@/modules/exam_group/module";
import {QuestionModule} from "@/modules/question/module";
import {ExamModule} from "@/modules/exam/module";
import {PDFViewerModule} from "@/modules/pdf-viewer/module";
import {AnswerModule} from "@/modules/answer/module";
import {ExamResultModule} from "@/modules/exam_result/module";

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        // for all routes
        mount: true,
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    DatabaseModule,
    AuthModule,
    StudentModule,
    TeacherModule,
    ClassModule,
    InvitationModule,
    ExamGroupModule,
    QuestionModule,
    ExamModule,
    PDFViewerModule,
    AnswerModule,
    ExamResultModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
