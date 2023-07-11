import { Request, Response } from "express";
import { WalletService } from "../services/wallet.service";
import { injectable } from "tsyringe";
import { UserBalanceService } from "../services/user-balance.service";
const walletService = new WalletService()

@injectable()
export class WalletController {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    async getCurrency(req: Request, res: Response) {
        const result = await walletService.getAllCurrency()
        return res.json(result)
    }

    async createCryptocurrency(req: Request, res: Response) {
        const { currency_name, symbol } = req.body
        const createDto = { currency_name, symbol }

        const result = await walletService.createCurrency(createDto)
        return res.json(result)
    }

    async getExchangeRateCurrency(req: Request, res: Response) {
        const result = await walletService.getAllExchangeRate()
        return res.json(result)
    }

    async createExchangeRateCurrency(req: Request, res: Response) {
        const { source_currency, target_currency } = req.body as { [key: string]: string }
        const { rate } = req.body as { [key: string]: number }
        const createDto = { source_currency, target_currency, rate }

        const result = await walletService.createExchangeRate(createDto)
        return res.json(result)
    }

    async updateExchangeRateCurrency(req: Request, res: Response) {
        const { exchange_rate_id } = req.body as { [key: string]: string }
        const { rate } = req.body as { [key: string]: number }

        const result = await walletService.updateExchangeRate(rate, exchange_rate_id)
        return res.json(result)
    }

    async tranferCurrency(req: Request, res: Response) {
        const { source_id, target_id, source_currency, target_currency } = req.body as { [key: string]: string }
        const { balance: balanceInput } = req.body as { [key: string]: number }

        const userBalanceService = new UserBalanceService()

        try {
            if (source_currency === target_currency) {
                const sourceUser = await userBalanceService.getOne(source_id, source_currency)
                const targeteUser = await userBalanceService.getOne(target_id, source_currency)
                if (sourceUser && targeteUser && source_currency) {
                    const { balance: balanceSource } = sourceUser.dataValues as { [key: string]: string }
                    const { balance: balanceTarget } = targeteUser.dataValues as { [key: string]: string }
                    if (Number(balanceSource) >= Number(balanceInput)) {
                        const newBalanceSource = Number(balanceSource) - balanceInput
                        const newBalanceTarget = Number(balanceTarget) + balanceInput

                        await userBalanceService.updateUserBalance(newBalanceSource, source_currency, source_id)
                        await userBalanceService.updateUserBalance(newBalanceTarget, source_currency, target_id)
                        return res.json(`Tranfer ${source_currency}: ${balanceInput} Successful`)
                    }
                    else { return res.json(`Balance ${source_currency} insufficient`) }
                }
                else { return res.json(`Can't tranfer  ${source_currency} ==> ${target_currency}`) }
            }
            else {
                const sourceUser = await userBalanceService.getOne(source_id, source_currency)
                const targeteUser = await userBalanceService.getOne(target_id, target_currency)
                if (sourceUser && targeteUser) {
                    const exchangeRate = await walletService.getOneExchangeRate(source_currency, target_currency)
                    const { balance: balanceSource } = sourceUser.dataValues as { [key: string]: string }

                    if (exchangeRate) {
                        const { rate } = exchangeRate
                        if (Number(balanceSource) >= Number(balanceInput)) {
                            const newBalanceSource = Number(balanceSource) - balanceInput
                            const newBalanceTarget = Number(rate) * balanceInput

                            await userBalanceService.updateUserBalance(newBalanceSource, source_currency, source_id)
                            await userBalanceService.updateUserBalance(newBalanceTarget, target_currency, target_id)
                            return res.json(`Tranfer ${source_currency}: ${balanceInput} token. Successful`)
                        }
                        else { return res.json(`Balance ${source_currency} insufficient`) }
                    }
                    else { return res.json(`Not found ExchangeRate ${source_currency}/${target_currency}`) }
                }
                else { return res.json(`Can't tranfer  ${source_currency} ==> ${target_currency}`) }
            }
        }
        catch (error) {
            return res.json(error)
        }
    }

}