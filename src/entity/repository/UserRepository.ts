import {EntityRepository, getManager, getRepository, Repository} from "typeorm";
import User from "../User";
import {UserSignUpInterface} from "../../interfaces/UserSignUpInterface";
import * as moment from "moment";
import {validate, ValidationError} from "class-validator";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    public findByName(displayName: string) {
        return this.findOne({ where: { displayName }});
    }

    public async getAllUsers (): Promise<User[]> {
        return await this.find();
    }

    public async createUser (userData: UserSignUpInterface): Promise<User> {

        let bcrypt = require('bcrypt');
        let saltRounds = (undefined!==process)?process.env.USER_SALT_ARROUND:10;
        // User Data
        let now = moment().format('YYYY-MM-D HH:mm:ss');
        userData.salt = bcrypt.genSaltSync(saltRounds);
        userData.passwordHashed = bcrypt.hashSync(userData.password, userData.salt);
        userData.activationCode = Buffer.from(bcrypt.hashSync(userData.username+userData.email+now, userData.salt)).toString('base64');
        userData.uuid = Buffer.from(bcrypt.hashSync(userData.username+userData.email, userData.salt)).toString('base64');

        let newUser = new User();
        newUser.displayName = userData.displayName;
        newUser.username = userData.username;
        newUser.email = userData.email;
        newUser.password = userData.passwordHashed;
        newUser.salt = userData.salt;
        newUser.activationCode = userData.activationCode;
        newUser.isActive = userData.isActive;
        newUser.createdBy = await getRepository(User).findOne({
            username: 'admin'
        });
        newUser.updatedBy = newUser.createdBy;

        const errors = await validate(newUser);
        if (errors.length > 0) {
            throw errors;
        } else {
            await getManager().save(newUser);
        }

        return newUser;

    }

}
