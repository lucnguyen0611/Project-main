import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueEmailIndex1759549249390 implements MigrationInterface {
  name = 'AddUniqueEmailIndex1759549249390';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // drop old indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_email_active"`);

    // create partial unique index: for user who has active = true
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_user_email_active"
                ON "user" ("email")
                WHERE "active" = true;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop index when rollback
    await queryRunner.query(`DROP INDEX "IDX_user_email_active"`);
  }
}
