import * as sequelize from "sequelize";
import {LogFactory} from "./log";
import {config} from '../util/config'
import {Dialect} from "sequelize";

export const dbConfig = new sequelize.Sequelize(
    (process.env.DB_NAME = config.dbName),
    (process.env.DB_USER = config.dbUser),
    (process.env.DB_PASSWORD = config.dbPass),
    {
        port: config.dbPort,
        host: config.dbHost || "localhost",
        dialect: config.dbDriver as Dialect,
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000,
        },
    }
);

// SOMETHING VERY IMPORTANT them Factory functions expect a
// sequelize instance as parameter give them `dbConfig`

export const Log = LogFactory(dbConfig);
