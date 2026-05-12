import {Database} from "../utils/database";
import {log} from "../utils/utils";

async function initDB() {

    try {
        await Database.initialize()
        log("SUCCESS", "setupDB.ts", `Database Initialized`);
    } catch (e) {
        // @ts-ignore
        log("ERROR", "setupDB.ts", `unable to initialize Database: ${e.message}`);
        process.exit(10)
    }
}

export {initDB}