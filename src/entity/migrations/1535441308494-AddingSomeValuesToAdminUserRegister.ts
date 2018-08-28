import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingSomeValuesToAdminUserRegister1535441308494 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`UPDATE "user" SET 
            created_by_id = (SELECT id FROM (SELECT * FROM "user") AS user_table WHERE username = 'admin' LIMIT 1), 
            updated_by_id = (SELECT id FROM (SELECT * FROM "user") AS user_table WHERE username = 'admin' LIMIT 1) 
            WHERE username = 'admin'`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`UPDATE "user" SET 
            created_by_id = null, 
            updated_by_id = null 
            WHERE username = 'admin'`);
    }

}
