// src/migrations/1760565000000-UpdateCategoriaParentNullable.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCategoriaParentNullable1760565000000 implements MigrationInterface {
    name = 'UpdateCategoriaParentNullable1760565000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Altera a coluna parent_id para permitir NULL
        await queryRunner.query(`ALTER TABLE "categoria" ALTER COLUMN "parent_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Restaura a coluna parent_id como NOT NULL
        await queryRunner.query(`ALTER TABLE "categoria" ALTER COLUMN "parent_id" SET NOT NULL`);
    }
}
