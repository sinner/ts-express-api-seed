import {Service} from "@tsed/common";
import {UserSignUpInterface} from "../interfaces/UserSignUpInterface";
import {UserRepository} from "../entity/repository/UserRepository";
import {APIResponseInterface} from "../interfaces/APIResponseInterface";
import {getCustomRepository} from "typeorm";
import {User} from "../entity/User";

@Service()
export class UserService {

    private userRepository: UserRepository;
    private result: APIResponseInterface;

    constructor () {
        this.userRepository = getCustomRepository(UserRepository);
        this.result = {
            status: 500,
            error: {
                detail: 'It has occurred an unexpected error during the process. Refresh the page a try it again.'
            },
            message: 'It has occurred an unexpected error during the process. Refresh the page a try it again.',
            data: null
        };
    }

    signupSimpleUser (userData: UserSignUpInterface): APIResponseInterface {
        userData.roles = ['ROLE_USER'];
        userData.isActive = 0;

        this.result.data = {
            user: userData,
            success: false
        };

        try {

            let newUser = this.userRepository.createUser(userData);
            this.result.error = null;
            this.result.data = {
                user: newUser,
                success: true
            };
            this.result.message = 'The sign-up process was completed successfully. An email was sent to confirm you registration.';
            this.result.status = 201;

            //TODO: Throw an event that will send an email to complete the user signed-up verification

        }
        catch (e) {
            console.log(e);
            this.result.status = 400;
            this.result.error = {
                detail: e
            };
            this.result.message = 'It has occurred an error during the sign-up process.';
        }
        return this.result;
    }

    async getUserList(): Promise<APIResponseInterface> {

        this.result.data = {
            users: [],
            success: false
        };

        try {

            let userList: User[] = await this.userRepository.getAllUsers();
            this.result.error = null;
            this.result.data = {
                users: userList,
                success: true
            };
            this.result.message = 'The list of user was obtained successfully.';
            this.result.status = 200;

        }
        catch (e) {
            console.log(e);
            this.result.status = 400;
            this.result.error = {
                detail: e
            };
            this.result.message = 'It has occurred an error during the process.';
        }
        return this.result;
    }

}