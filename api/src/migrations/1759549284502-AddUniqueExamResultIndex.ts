import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueExamResultIndex1759549284502
  implements MigrationInterface
{
  name = 'AddUniqueExamResultIndex1759549284502';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_exam_result_user_exam_active"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_exam_result_exam_user_active" ON "exam_result" ("exam_id", "user_id") WHERE "active" = true; `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_exam_result_exam_user_active"`);
  }
}
