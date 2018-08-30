import {
    Controller, Get, Render, Post,
    Authenticated, Required, BodyParams,
    Delete, Status, PathParams, Req, Res
} from "@tsed/common";
import * as Express from "express";

import {APIResponseInterface} from "../../../interfaces/APIResponseInterface";
import {UserService} from "../../../services/UserService";
import {UserSignUpInterface} from "../../../interfaces/UserSignUpInterface";

@Controller("/user")
export class UserAccessController {

    constructor (private userService: UserService) {
    }

    @Get("/")
    async list(
        @Req() request: Express.Request,
        @Res() response: Express.Response
    ): Promise<any> {
        return await this.userService.getUserList();
    }

    @Post("/sign-up")
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