import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1761226291553 implements MigrationInterface {
    name = 'NewMigration1761226291553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'editor')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'editor', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" SERIAL NOT NULL, "number" character varying NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "iconKey" character varying NOT NULL, "order" integer NOT NULL DEFAULT '0', "steps" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."pricing_plans_pricingtype_enum" AS ENUM('simple', 'platform_based')`);
        await queryRunner.query(`CREATE TYPE "public"."pricing_plans_platform_enum" AS ENUM('facebook', 'linkedin', 'tiktok', 'instagram', 'twitter', 'youtube', 'google', 'general')`);
        await queryRunner.query(`CREATE TABLE "pricing_plans" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" character varying NOT NULL, "features" json NOT NULL, "highlight" boolean NOT NULL DEFAULT false, "order" integer NOT NULL DEFAULT '0', "serviceId" integer, "originalPrice" character varying, "discount" character varying, "targetAudience" character varying, "buttonText" character varying, "pricingType" "public"."pricing_plans_pricingtype_enum" NOT NULL DEFAULT 'simple', "platform" "public"."pricing_plans_platform_enum", "subtitle" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_57aa9837d4777aafc70ba090fb6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pricing_plans"`);
        await queryRunner.query(`DROP TYPE "public"."pricing_plans_platform_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pricing_plans_pricingtype_enum"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
