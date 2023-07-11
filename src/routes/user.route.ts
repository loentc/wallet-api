import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const UserRouter = Router()
const userController = new UserController()

UserRouter.post('/register', userController.createUser)

export default UserRouter