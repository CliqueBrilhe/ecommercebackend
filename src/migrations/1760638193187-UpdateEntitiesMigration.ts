import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntitiesMigration1760638193187 implements MigrationInterface {
    name = 'UpdateEntitiesMigration1760638193187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "blingId" bigint`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "UQ_874f5212af044675341082ccc2e" UNIQUE ("blingId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "UQ_874f5212af044675341082ccc2e"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "blingId"`);
    }

}
