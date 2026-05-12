import { Pool, Client } from 'pg'
import config from "../../config/config.json";
import {log} from "../utils/utils";

async function setupDB() {

    const client = new Client({
        user: config.dbuser,
        password: config.dbpass,
        host:config.dbhost,
        port: config.dbport,
        database: config.dbname
    })

    try {
        await client.connect()
        log("SUCCESS", "Database.ts", `connected to Database`);

    } catch (e) {
        // @ts-ignore
        log("ERROR", "Database.ts", `unable to connect to Database: ${e.message}`);
        await client.end();
        process.exit(10)
    }
}

export { setupDB }