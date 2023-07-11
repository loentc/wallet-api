import { Request, Response } from "express";
import { UserBalanceService } from "../services/user-balance.service";
import { UserService } from "../services/user.service";
const userBalanceService = new UserBalanceService()


export class UserBalanceController {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    async createUserBalance(req: Request, res: Response) {
        const { user_id, currency_name } = req.body as { [key: string]: string }
        const { balance } = req.body as { [key: string]: number }

        const userService = new UserService()

        try {
            const hasUser = await userService.getOne(user_id)
            if (hasUser) {
                await userBalanceService.create({ currency_name, user_id, balance })
                return res.json(`Create balance user: ${user_id} Successful`)
            }
            else {
                return res.json(`Data not found user : ${user_id}`)
            }
        } catch (error) {
            return res.json(error)
        }
    }

    async getBalance(req: Request, res: Response) {
        const result = await userBalanceService.getAll(req.query.userId as string)
        return res.json(result)
    }

    async totalBalance(req: Request, res: Response) {
        const { currencyName } = req.query as { [key: string]: string }
        const result = await userBalanceService.getTotalBalance(currencyName)
        return res.json(result)
    }

    async manageUserBalance(req: Request, res: Response) {
        const { user_id, currency_name } = req.body as { [key: string]: string }
        const { balance } = req.body as { [key: string]: number }

        const result = await userBalanceService.updateUserBalance(balance, currency_name, user_id)
        return res.json(result)
    }
}