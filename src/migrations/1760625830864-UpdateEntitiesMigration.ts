import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntitiesMigration1760625830864 implements MigrationInterface {
    name = 'UpdateEntitiesMigration1760625830864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "path" character varying(255), "order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "parent_id" integer, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "bling_id" bigint, "code" character varying NOT NULL, "name" character varying NOT NULL, "stock_quantity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "promotion" integer NOT NULL DEFAULT '0', "width" numeric(5,2), "height" numeric(5,2), "depth" numeric(5,2), "images" text NOT NULL DEFAULT '', "description" text, "synchronized" boolean NOT NULL DEFAULT false, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" integer, CONSTRAINT "UQ_3d0f2100d1e232157efa5041d51" UNIQUE ("bling_id"), CONSTRAINT "UQ_99c39b067cfa73c783f0fc49a61" UNIQUE ("code"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('under_review', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "productValue" numeric(10,2) NOT NULL, "shippingValue" numeric(10,2) NOT NULL, "status" "public"."order_status_enum" NOT NULL DEFAULT 'under_review', "productId" integer, "userId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "nome"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "cep"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "dataNascimento"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP CONSTRAINT "UQ_59bc805e13413e4be83be3a7752"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "login"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "senha"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "tipoUsuario"`);
        await queryRunner.query(`DROP TYPE "public"."usuario_tipousuario_enum"`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "zipCode" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "birthDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD CONSTRAINT "UQ_6ccff37176a6978449a99c82e10" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."usuario_usertype_enum" AS ENUM('admin', 'common')`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "userType" "public"."usuario_usertype_enum" NOT NULL DEFAULT 'common'`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_1117b4fcb3cd4abb4383e1c2743" FOREIGN KEY ("parent_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_88991860e839c6153a7ec878d39" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_88991860e839c6153a7ec878d39"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_1117b4fcb3cd4abb4383e1c2743"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "userType"`);
        await queryRunner.query(`DROP TYPE "public"."usuario_usertype_enum"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP CONSTRAINT "UQ_6ccff37176a6978449a99c82e10"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "birthDate"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "zipCode"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "name"`);
        await queryRunner.query(`CREATE TYPE "public"."usuario_tipousuario_enum" AS ENUM('admin', 'comum')`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "tipoUsuario" "public"."usuario_tipousuario_enum" NOT NULL DEFAULT 'comum'`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "senha" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "login" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD CONSTRAINT "UQ_59bc805e13413e4be83be3a7752" UNIQUE ("login")`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "dataNascimento" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "cep" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "nome" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
