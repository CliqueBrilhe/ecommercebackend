import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlingFieldsToProduto1760556408025
  implements MigrationInterface
{
  name = 'AddBlingFieldsToProduto1760556408025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "produto" DROP COLUMN "quantidadeEstoque"`,
    );
    await queryRunner.query(`ALTER TABLE "produto" ADD "bling_id" bigint`);
    await queryRunner.query(
      `ALTER TABLE "produto" ADD CONSTRAINT "UQ_700ad18f91fdb0fb5e921cbd285" UNIQUE ("bling_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "produto" ADD "quantidade_estoque" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "produto" ADD "sincronizado" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "produto" ADD "atualizado_em" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "produto" ADD "criado_em" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "produto" ALTER COLUMN "largura" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "produto" ALTER COLUMN "altura" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "produto" ALTER COLUMN "profundidade" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "produto" ALTER COLUMN "descricao" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "produto" ALTER COLUMN "descricao" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "produto" ALTER COLUMN "profundidade" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "produto" ALTER COLUMN "altura" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "produto" ALTER COLUMN "largura" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "produto" DROP COLUMN "criado_em"`);
    await queryRunner.query(
      `ALTER TABLE "produto" DROP COLUMN "atualizado_em"`,
    );
    await queryRunner.query(`ALTER TABLE "produto" DROP COLUMN "sincronizado"`);
    await queryRunner.query(
      `ALTER TABLE "produto" DROP COLUMN "quantidade_estoque"`,
    );
    await queryRunner.query(
      `ALTER TABLE "produto" DROP CONSTRAINT "UQ_700ad18f91fdb0fb5e921cbd285"`,
    );
    await queryRunner.query(`ALTER TABLE "produto" DROP COLUMN "bling_id"`);
    await queryRunner.query(
      `ALTER TABLE "produto" ADD "quantidadeEstoque" integer NOT NULL`,
    );
  }
}
