import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1759548981507 implements MigrationInterface {
  name = 'InitialSchema1759548981507';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "class" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" bigint, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" bigint, "deleted_at" TIMESTAMP, "deleted_by" bigint, "active" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "class_user" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" bigint, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" bigint, "deleted_at" TIMESTAMP, "deleted_by" bigint, "active" boolean NOT NULL DEFAULT true, "class_id" bigint NOT NULL, "user_id" bigint NOT NULL, CONSTRAINT "PK_5641eaea4fba6e3e749b40b0d17" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."question_type_enum" AS ENUM('single-choice', 'multiple-choice', 'long-response')`,
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" bigint, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" bigint, "deleted_at" TIMESTAMP, "deleted_by" bigint, "active" boolean NOT NULL DEFAULT true, "exam_id" bigint NOT NULL, "index" integer NOT NULL, "type" "public"."question_type_enum" NOT NULL DEFAULT 'multiple-choice', "correct_answer" character varying NOT NULL, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exam_group" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" bigint, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" bigint, "deleted_at" TIMESTAMP, "deleted_by" bigint, "active" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "class_id" bigint NOT NULL, "start_time" TIMESTAMP NOT NULL, "await_time" integer NOT NULL, "is_once" boolean NOT NULL, "is_save_local" boolean NOT NULL, CONSTRAINT "PK_fb7f064ddab98094253537e3364" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exam" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" bigint, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" bigint, "deleted_at" TIMESTAMP, "deleted_by" bigint, "active" boolean NOT NULL DEFAULT true, "exam_group_id" bigint NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "number_of_question" integer NOT NULL, "total_time" integer NOT NULL, "description" character varying NOT NULL, "file_id" bigint NOT NULL, CONSTRAINT "REL_a603160b0c73938fd9d951e632" UNIQUE ("file_id"), CONSTRAINT "PK_56071ab3a94aeac01f1b5ab74aa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" bigint, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" bigint, "deleted_at" TIMESTAMP, "deleted_by" bigint, "active" boolean NOT NULL DEFAULT true, "public_id" character varying NOT NULL, "url" character varying NOT NULL, "viewable_url" character varying, "original_name" character varying NOT NULL, "file_type" character varying(50) NOT NULL, "size" integer NOT NULL, CONSTRAINT "UQ_d0ee3ef4ad06724c1c17e7558af" UNIQUE ("public_id"), CONSTRAINT "UQ_ff5d246bb5831ad7351f87e67cb" UNIQUE ("url"), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'student', 'teacher')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" bigint, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" bigint, "deleted_at" TIMESTAMP, "deleted_by" bigint, "active" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "email" character varying NOT NULL, "status" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'student', "password" character varying NOT NULL, "school" character varying, "parent_name" character varying, "parent_phone" character varying, "avatar" bigint, CONSTRAINT "REL_b613f025993be2d1e51ba4c2b5" UNIQUE ("avatar"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "password_reset_token" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" bigint, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" bigint, "deleted_at" TIMESTAMP, "deleted_by" bigint, "active" boolean NOT NULL DEFAULT true, "user_id" bigint NOT NULL, "token" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "is_used" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_6c50e3a3bee2912c1153c63aa64" UNIQUE ("token"), CONSTRAINT "PK_838af121380dfe3a6330e04f5bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exam_result" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" bigint, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" bigint, "deleted_at" TIMESTAMP, "deleted_by" bigint, "active" boolean NOT NULL DEFAULT true, "user_id" bigint NOT NULL, "exam_id" bigint NOT NULL, "status" character varying NOT NULL, "device" character varying NOT NULL, "number_of_correct_answer" integer NOT NULL DEFAULT '0', "score" double precision, CONSTRAINT "PK_9c05af0457cef1ec4ee5f074df7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "answer" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" bigint, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" bigint, "deleted_at" TIMESTAMP, "deleted_by" bigint, "active" boolean NOT NULL DEFAULT true, "exam_result_id" bigint NOT NULL, "question_id" bigint NOT NULL, "answer" character varying NOT NULL, "is_correct" boolean array, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_user" ADD CONSTRAINT "FK_ea2612847e768dbd9ab2d337acb" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_user" ADD CONSTRAINT "FK_03c18b1b30e7c5f77618030070e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_7320b43dd91d88b143705930c0a" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_group" ADD CONSTRAINT "FK_f367da26f3884ca77a75f4beb94" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam" ADD CONSTRAINT "FK_9af0ea86bccc8e8808d2cfda7dc" FOREIGN KEY ("exam_group_id") REFERENCES "exam_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam" ADD CONSTRAINT "FK_a603160b0c73938fd9d951e6326" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_b613f025993be2d1e51ba4c2b5f" FOREIGN KEY ("avatar") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset_token" ADD CONSTRAINT "FK_7eabb22ed38459ffc24dc8b415d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_result" ADD CONSTRAINT "FK_59efb5fb504599166bd8fb35b2b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_result" ADD CONSTRAINT "FK_2228433a38ba8b4e8928076bdc6" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_3f5963b562a8ebb95a3239b7998" FOREIGN KEY ("exam_result_id") REFERENCES "exam_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_3f5963b562a8ebb95a3239b7998"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_result" DROP CONSTRAINT "FK_2228433a38ba8b4e8928076bdc6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_result" DROP CONSTRAINT "FK_59efb5fb504599166bd8fb35b2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset_token" DROP CONSTRAINT "FK_7eabb22ed38459ffc24dc8b415d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_b613f025993be2d1e51ba4c2b5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam" DROP CONSTRAINT "FK_a603160b0c73938fd9d951e6326"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam" DROP CONSTRAINT "FK_9af0ea86bccc8e8808d2cfda7dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_group" DROP CONSTRAINT "FK_f367da26f3884ca77a75f4beb94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_7320b43dd91d88b143705930c0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_user" DROP CONSTRAINT "FK_03c18b1b30e7c5f77618030070e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_user" DROP CONSTRAINT "FK_ea2612847e768dbd9ab2d337acb"`,
    );
    await queryRunner.query(`DROP TABLE "answer"`);
    await queryRunner.query(`DROP TABLE "exam_result"`);
    await queryRunner.query(`DROP TABLE "password_reset_token"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "exam"`);
    await queryRunner.query(`DROP TABLE "exam_group"`);
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(`DROP TYPE "public"."question_type_enum"`);
    await queryRunner.query(`DROP TABLE "class_user"`);
    await queryRunner.query(`DROP TABLE "class"`);
  }
}
