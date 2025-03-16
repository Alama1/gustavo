import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1742091723338 implements MigrationInterface {
  name = 'Migrations1742091723338';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "watch_list" ("id" varchar PRIMARY KEY NOT NULL, "user_id" text NOT NULL, "avatar" text NOT NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "watch_list"`);
  }
}
