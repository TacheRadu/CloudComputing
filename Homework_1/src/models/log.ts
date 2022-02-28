import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
export interface LogAttributes {
    id: number
    latency: number
    requestType: "basic" | "location" | "randint" | "weather" | "misc"
    request: string
    response: string
    createdAt?: Date;
    updatedAt?: Date;
}
export interface LogModel extends Model<LogAttributes>, LogAttributes{}
export class Log extends Model<LogModel, LogAttributes> {}

export type LogStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): LogModel;
};

export function LogFactory (sequelize: Sequelize): LogStatic {
    return <LogStatic>sequelize.define("logs", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        latency: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        requestType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        request: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        response: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });
}