import {MigrationInterface, QueryRunner} from "typeorm";
import {getConnectionManager} from "typeorm";
import envVars from "../../bootstrap/env";
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';

export class true1517953427089 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        // Initial Database User Structure
        await queryRunner.query("CREATE TABLE `user` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `uuid` varchar(150) NOT NULL UNIQUE, `email` varchar(180) NOT NULL UNIQUE, `username` varchar(50) NOT NULL UNIQUE, `password` varchar(150) NOT NULL, `salt` varchar(150) NOT NULL, `display_name` varchar(150) NOT NULL, `activation_code` varchar(150) NOT NULL, `roles` text NOT NULL, `created_at` timestamp NOT NULL, `updated_at` timestamp NOT NULL, `is_active` tinyint(4) NOT NULL) ENGINE=InnoDB");

        const saltRounds = parseInt((undefined!==process)?process.env.USER_SALT_ARROUND:'10');

        // User Data
        let adminMail = (undefined!==process)?process.env.ADMIN_EMAIL:'';
        let adminUsername = (undefined!==process)?process.env.INITIAL_ADMIN_USERNAME:'admin';
        let adminPassword = (undefined!==process)?process.env.INITIAL_ADMIN_PASSWORD:'admin';
        let adminSalt = bcrypt.genSaltSync(saltRounds);
        let adminPasswordHashed = bcrypt.hashSync(adminPassword, adminSalt);
        let now = moment().format('YYYY-MM-D HH:mm:ss');
        let activationCode = Buffer.from(bcrypt.hashSync(adminPassword+adminUsername+adminMail+now, adminSalt)).toString('base64');
        let uuid = Buffer.from(bcrypt.hashSync(adminUsername+adminMail, adminSalt)).toString('base64');

        // Creating an admin user
        await queryRunner.query("INSERT INTO `user` (`uuid`, `email`, `username`, `display_name`, `salt`, `password`, `activation_code`, `roles`, `is_active`, `created_at`, `updated_at`) VALUES ('"+uuid+"', '"+adminMail+"', '"+adminUsername+"', 'Administrator', '"+adminSalt+"', '"+adminPasswordHashed+"', '"+activationCode+"', 'ROLE_SUPER_ADMIN,ROLE_ADMIN', true, '"+now+"', '"+now+"')");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `user`");
    }

}
