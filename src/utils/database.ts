import config from "../../config/config.json";
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Game } from "../entity/Game"

export const Database = new DataSource({
    type: "postgres",
    host: config.dbhost,
    port: config.dbport,
    username: config.dbuser,
    password: config.dbpass,
    database: config.dbname,
    synchronize: true,
    logging: false,
    entities: [Game],
    migrations: [],
    subscribers: [],
})