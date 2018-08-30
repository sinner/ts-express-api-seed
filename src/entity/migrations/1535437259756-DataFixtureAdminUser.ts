import {MigrationInterface, QueryRunner, Connection, createConnection, getConnection, getConnectionManager} from "typeorm";
import envVars from "../../bootstrap/env";
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import * as Fs from "fs";
import * as Path from "path";
import "reflect-metadata";
import User from "../User";

export class DataFixtureAdminUser1535437259756 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        const connection = await this.getConnection()

        try {
            let {
                adminMail,
                adminUsername,
                adminSalt,
                adminPasswordHashed,
                activationCode,
                uuid
            } = this.generateUserData();

            let user = new User();
            user.displayName = "Super Admin";
            user.firstName = "Super";
            user.lastName = "Admin";
            user.email = adminMail;
            user.username = adminUsername;
            user.password = adminPasswordHashed;
            user.activationCode = activationCode;
            user.uuid = uuid;
            user.salt = adminSalt;
            user.isActive = true;
            user.isEmailConfirmed = true;
            user.addRole("ROLE_SUPER_ADMIN");
        
            await connection.manager.save(user);

            console.log("Admin User has been saved");
        }
        catch(error) {
            console.log(error);
            process.exit(1);
        };

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE FROM "user" WHERE username='admin'`);
    }

    private async getConnection (): Promise<Connection> {
        const rootDir = Path.resolve(__dirname+'/../../..');
        const dbSettingsPath = `${rootDir}/ormconfig.json`;
        const databaseSettings = JSON.parse(Fs.readFileSync(dbSettingsPath, 'utf8'));
        try {
            let connection = getConnection();
            return connection;
        }
        catch (error) {
            let connection: Connection = await createConnection({
                ...databaseSettings
            });
            return connection;
        }
    }

    private generateUserData (): any {
        const saltRounds = parseInt((undefined!==process)?process.env.USER_SALT_ARROUND:'10');
        let adminMail = (undefined!==process)?process.env.ADMIN_EMAIL:'';
        let adminUsername = (undefined!==process)?process.env.INITIAL_ADMIN_USERNAME:'admin';
        let adminPassword = (undefined!==process)?process.env.INITIAL_ADMIN_PASSWORD:'admin';
        let adminSalt = bcrypt.genSaltSync(saltRounds);
        let adminPasswordHashed = bcrypt.hashSync(adminPassword, adminSalt);
        let now = moment().format('YYYY-MM-D HH:mm:ss');
        let activationCode = Buffer.from(bcrypt.hashSync(adminPassword+adminUsername+adminMail+now, adminSalt)).toString('base64');
        let uuid = Buffer.from(bcrypt.hashSync(adminUsername+adminMail, adminSalt)).toString('base64');
        return {
            adminMail,
            adminUsername,
            adminSalt,
            adminPasswordHashed,
            activationCode,
            uuid
        };
    }

}
