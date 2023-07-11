import { Router } from "express";
import { UserBalanceController } from "../controllers/user-balance.controller";
import { authorizeAdminRole } from "../middleware/authorization";

const UserBalanceRouter = Router()
const userBalanceController = new UserBalanceController()

UserBalanceRouter.post('/create-balance', userBalanceController.createUserBalance)

UserBalanceRouter.get('/get-balance', authorizeAdminRole, userBalanceController.getBalance)

UserBalanceRouter.get('/total-balance', authorizeAdminRole, userBalanceController.totalBalance)

UserBalanceRouter.put('/manage-balance', authorizeAdminRole, userBalanceController.manageUserBalance)

export default UserBalanceRouter