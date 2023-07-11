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
            return 'Create user successful'
        }
        catch (error) {
            return error
        }
    }

    async getOne(userId: string) {
        try {
            const userData = await User.findOne({ where: { id: userId } })
            return userData.dataValues
        }
        catch (error) {
            return error
        }
    }

    async getAll() {
        try {
            const userData = await User.findAll()
            return userData
        }
        catch (error) {
            return error
        }
    }
}