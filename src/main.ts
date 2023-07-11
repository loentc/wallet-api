import "reflect-metadata";
import express from 'express';
import UserRouter from './routes/user.route';
import WalletRouter from "./routes/wallet.route";
import { createTables } from './common/database';
import { createServer } from "http";
import dotenv from 'dotenv';
import UserBalanceRouter from "./routes/user-balance.route";
dotenv.config()

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.send({ message: 'Hello API Express' });
});

createServer(app,).listen(port, host, (() => {
  console.log(`[ ready ] http://${host}:${port}`);
}))
createTables()

app.use('/user', UserRouter)
app.use('/wallet', WalletRouter)
app.use('/user-balance', UserBalanceRouter)