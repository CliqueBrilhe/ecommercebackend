import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntitiesMigration1761164305026 implements MigrationInterface {
    name = 'UpdateEntitiesMigration1761164305026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "status" character varying(20) NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "status"`);
    }

}
