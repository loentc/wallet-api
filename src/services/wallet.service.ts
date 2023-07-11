import { injectable } from "tsyringe";
import { Cryptocurrency, ExchangeRate } from "../common/database";
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class WalletService {

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    async getAllCurrency() {
        try {
            const currencyData = await Cryptocurrency.findAll()
            return currencyData
        }
        catch (error) {
            return error
        }
    }

    async createCurrency(createCurrencyDto: { currency_name: string, symbol: string }) {
        try {
            await Cryptocurrency.create({ ...createCurrencyDto })
            return 'Create new currency successful'
        }
        catch (error) {
            return error
        }
    }

    async getAllExchangeRate() {
        try {
            const exchangeRateResult = await ExchangeRate.findAll()
            return exchangeRateResult
        }
        catch (error) {
            return error
        }
    }

    async getOneExchangeRate(sourceCurrency: string, targetCurrency: string) {
        try {
            const exchangeRateResult = await ExchangeRate.findOne({ where: { source_currency: sourceCurrency, target_currency: targetCurrency } })
            return exchangeRateResult?.dataValues
        }
        catch (error) {
            return error
        }
    }

    async createExchangeRate(createExchangeRateDto: { source_currency: string, target_currency: string, rate: number }) {
        try {
            await ExchangeRate.create({ id: uuidv4(), ...createExchangeRateDto })
            return `Create exchange rate successful`
        }
        catch (error) {
            return error
        }
    }

    async updateExchangeRate(rate: number, exchange_rate_id: string) {
        try {
            await ExchangeRate.update({ rate }, { where: { id: exchange_rate_id } })
            return 'Update exchange rate successful'
        }
        catch (error) {
            return error
        }
    }

}