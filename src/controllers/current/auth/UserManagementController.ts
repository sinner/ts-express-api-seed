import {
    Controller, Get, Render, Post,
    Authenticated, Required, BodyParams,
    Delete, Status, PathParams, Req, Res
} from "@tsed/common";
import * as Express from "express";
import {Title, Description, Summary, Returns} from "@tsed/swagger";

import {APIResponseInterface} from "../../../interfaces/APIResponseInterface";
import {UserService} from "../../../services/UserService";
import {UserSignUpInterface} from "../../../interfaces/UserSignUpInterface";

@Controller("/user")
export class UserManagementCtrl {

    constructor (private userService: UserService) {
    }

    @Get("/")
    @Title("List the users")
    @Summary("List all users registered on the system")
    @Description("List all users registered on the system")
    @Status(200)
    async list(
        @Req() request: Express.Request,
        @Res() response: Express.Response
    ): Promise<any> {
        return await this.userService.getUserList();
    }

    @Post("/sign-up")
    @Title("Sign up process for simple users")
    @Summary("Sign up process for simple users")
    @Description("This endpoint will manage the process to start with a sign-up process")
    @Status(201)
    async signUpAction(
        @Req() request: Express.Request,
        @Res() response: Express.Response,
        @BodyParams("user") userData: UserSignUpInterface): Promise<APIResponseInterface> {

        let result: APIResponseInterface = this.userService.signupSimpleUser(userData);
        response.setHeader('status', result.status);
        return result;

    }

    @Get("/:id")
    async get(
        @PathParams("id") id: string
    ): Promise<any> {

    }

}