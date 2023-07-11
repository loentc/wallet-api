/* eslint-disable no-useless-catch */
import { injectable } from "tsyringe";
import { SequelizeModule, UserBalance } from "../common/database";
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class UserBalanceService {

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    async create(userBalanceDto: { currency_name: string, user_id: string, balance: number }) {
        try {
            const uuid = uuidv4()
            await UserBalance.create({ id: uuid, ...userBalanceDto })
            return `Create balance for userId: ${userBalanceDto.user_id} successful`
        }
        catch (error) {
            throw error
        }
    }

    async getAll(userId: string) {
        try {
            const tokenData = await UserBalance.findAll({ where: { user_id: userId } })
            return tokenData
        }
        catch (error) {
            return error
        }
    }

    async getOne(userId: string, currencyName: string): Promise<UserBalance> {
        try {
            const userBalance = await UserBalance.findOne({ attributes: ['currency_name', 'balance'], where: { user_id: userId, currency_name: currencyName } })
            return userBalance
        }
        catch (error) {
            throw error
        }
    }

    async getTotalBalance(currencyName: string) {
        try {
            const sumColumn = 'balance'
            const groupByColumn = 'currency_name'
            const totalBalance = await UserBalance.findAll({ attributes: [groupByColumn, [SequelizeModule.fn('SUM', SequelizeModule.col(sumColumn)), 'total']], group: groupByColumn })
            if (totalBalance) {
                return { totalBalance }
            }
            return `Not found currency: ${currencyName}.`
        }
        catch (error) {
            return error
        }
    }

    async updateUserBalance(balanceValue: number, currencyName: string, userId: string) {
        try {
            await UserBalance.update({ balance: balanceValue }, { where: { currency_name: currencyName, user_id: userId } })
            return `Update balance user: ${userId}. successful`
        }
        catch (error) {
            return error
        }
    }

}