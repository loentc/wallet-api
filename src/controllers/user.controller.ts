import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { injectable } from "tsyringe";

@injectable()
export class UserController {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    async createUser(req: Request, res: Response) {
        const userService = new UserService()
        const result = await userService.create(req)
        return res.json(result)
    }
}