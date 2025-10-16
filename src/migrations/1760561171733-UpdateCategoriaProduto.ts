import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategoriaProduto1760561171733 implements MigrationInterface {
    name = 'UpdateCategoriaProduto1760561171733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "produto" ALTER COLUMN "quantidade_estoque" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "produto" ALTER COLUMN "quantidade_estoque" SET DEFAULT '0'`);
    }

}
