import {MigrationInterface, QueryRunner} from "typeorm";

export class true1518022619776 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.query("UPDATE `user` SET " +
            "`created_by_id` = (SELECT `id` FROM (SELECT * FROM `user`) AS user_table WHERE `username` = 'admin' LIMIT 1), " +
            "`updated_by_id` = (SELECT `id` FROM (SELECT * FROM `user`) AS user_table WHERE `username` = 'admin') " +
            "WHERE `username` = 'admin'");
        
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `fk_38282b8c47b21e04b3d3e2782d1` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`)");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `fk_667ce22dd1ae8b9fbb08b6accd8` FOREIGN KEY (`updated_by_id`) REFERENCES `user`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `fk_667ce22dd1ae8b9fbb08b6accd8`");
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `fk_38282b8c47b21e04b3d3e2782d1`");
        await queryRunner.query("ALTER TABLE `user` DROP `updatedAt`");
        await queryRunner.query("ALTER TABLE `user` DROP `createdAt`");
    }

}
