import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class FixProdutoImagensDefault1700000000000 implements MigrationInterface {
  name = 'FixProdutoImagensDefault1700000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Atualiza todos os NULL para array vazio
    await queryRunner.query(`UPDATE "produto" SET "imagens" = '{}' WHERE "imagens" IS NULL`);

    // 2. Altera a coluna para NOT NULL com default '{}'
    await queryRunner.changeColumn(
      "produto",
      "imagens",
      new TableColumn({
        name: "imagens",
        type: "text",
        isArray: true,
        isNullable: false,
        default: "'{}'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverte: volta a permitir null
    await queryRunner.changeColumn(
      "produto",
      "imagens",
      new TableColumn({
        name: "imagens",
        type: "text",
        isArray: true,
        isNullable: true,
        default: null,
      }),
    );
  }
}
