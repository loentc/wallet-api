import { injectable } from "tsyringe";
import { Request } from "express";
import { User } from "../common/database";
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class UserService {

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    async create(req: Request) {
        try {
            await User.create({ id: uuidv4(), ...req.body })
            return 'Create Successful'
        }
        catch (error) {
            return error
        }

    }
}