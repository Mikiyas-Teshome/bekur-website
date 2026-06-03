import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1761284340414 implements MigrationInterface {
    name = 'NewMigration1761284340414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // All tables have already been created in previous migrations
        // This migration is empty to maintain migration history
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No tables were created in this migration, so nothing to drop
    }

}
