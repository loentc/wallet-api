import { DataTypes, Model, Sequelize } from 'sequelize';
import { PostgresConfigModuleOption } from '../config/postgres';
import bcrypt from 'bcrypt'

export const SequelizeModule = new Sequelize(PostgresConfigModuleOption);

export class User extends Model {
    declare id: number;
    declare name: string;
    declare lastname: string;
    declare email: string;
    declare username: string;
    declare password: string;

}
User.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: SequelizeModule,
        modelName: 'user',
        tableName: 'user',
        timestamps: true,
    }
);

export class Token extends Model {
    declare id: number;
    declare userId: number;
    declare token: string;

}
Token.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: SequelizeModule,
        modelName: 'token',
        tableName: 'token',
        timestamps: false,
    }
);

User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
});


export async function createTables() {
    try {
        await SequelizeModule.sync({ force: true }).then(() => {
            console.log('Database synchronized');
        })
            .catch((error) => {
                console.error('Error synchronizing database:', error);
            });
    } catch (error) {
        SequelizeModule.close();
        console.error('Error creating tables:', error);
    }
}