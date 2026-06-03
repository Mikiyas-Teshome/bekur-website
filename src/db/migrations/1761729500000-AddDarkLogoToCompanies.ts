import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDarkLogoToCompanies1761729500000 implements MigrationInterface {
  name = 'AddDarkLogoToCompanies1761729500000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN "darkLogo" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "darkLogo"`);
  }
}


