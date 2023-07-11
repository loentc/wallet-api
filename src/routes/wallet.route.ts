import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller";
import { authorizeAdminRole } from "../middleware/authorization";

const WalletRouter = Router()
const walletController = new WalletController()

WalletRouter.get('/currency', authorizeAdminRole, walletController.getCurrency)

WalletRouter.post('/currency', authorizeAdminRole, walletController.createCryptocurrency)

WalletRouter.get('/exchange-rate', authorizeAdminRole, walletController.getExchangeRateCurrency)

WalletRouter.post('/exchange-rate', authorizeAdminRole, walletController.createExchangeRateCurrency)

WalletRouter.put('/exchange-rate', authorizeAdminRole, walletController.updateExchangeRateCurrency)

WalletRouter.post('/tranfer', walletController.tranferCurrency)

export default WalletRouter