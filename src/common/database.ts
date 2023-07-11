import { DataTypes, Model, Sequelize } from 'sequelize';
import { PostgresConfigModuleOption } from '../config/postgres';
import bcrypt from 'bcrypt'
import { UserRole } from '../config/role';

export const SequelizeModule = new Sequelize(PostgresConfigModuleOption);

export class User extends Model {
    declare id: number;
    declare name: string;
    declare lastname: string;
    declare email: string;
    declare username: string;
    declare password: string;
    declare role: UserRole
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
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: UserRole.USER
        },
    },
    {
        sequelize: SequelizeModule,
        modelName: 'user',
        tableName: 'user',
    }
);

export class UserBalance extends Model {
    declare id: string
    declare user_id: string;
    declare currency_name: string
    declare balance: number
}
UserBalance.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        currency_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        balance: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        }
    },
    {
        sequelize: SequelizeModule,
        modelName: 'user_balance',
        tableName: 'user_balance',
    }
);

export class ExchangeRate extends Model {
    declare id: number;
    declare source_currency: string;
    declare target_currency: string
    declare rate: number
}
ExchangeRate.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        source_currency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        target_currency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rate: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        }
    },
    {
        sequelize: SequelizeModule,
        modelName: 'exchange_rate',
        tableName: 'exchange_rate',
    }
);

export class Cryptocurrency extends Model {
    declare symbol: string;
    declare currency_name: string
}
Cryptocurrency.init(
    {
        currency_name: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        symbol: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: SequelizeModule,
        modelName: 'cryptocurrency',
        tableName: 'cryptocurrency',
    }
);

User.hasMany(UserBalance, { foreignKey: 'user_id' })
UserBalance.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id', constraints: false })

UserBalance.belongsTo(Cryptocurrency, { foreignKey: 'currency_name' })
Cryptocurrency.hasMany(UserBalance, { foreignKey: 'currency_name' })

Cryptocurrency.hasMany(ExchangeRate, { foreignKey: 'source_currency' });
Cryptocurrency.hasMany(ExchangeRate, { foreignKey: 'target_currency' });

ExchangeRate.belongsTo(Cryptocurrency, { foreignKey: 'source_currency', targetKey: 'currency_name', constraints: false });
ExchangeRate.belongsTo(Cryptocurrency, { foreignKey: 'target_currency', targetKey: 'currency_name', constraints: false });


User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
});

export async function createTables() {
    try {
        await SequelizeModule.sync({ alter: true }).then(() => {
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