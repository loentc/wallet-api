import { Options } from "sequelize";

export const PostgresConfigModuleOption: Options = {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: Number(process.env.DB_PORT)
}