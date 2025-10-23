import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntitiesMigration1761238598330 implements MigrationInterface {
    name = 'UpdateEntitiesMigration1761238598330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" RENAME COLUMN "sincronizado" TO "synchronized"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" RENAME COLUMN "synchronized" TO "sincronizado"`);
    }

}
