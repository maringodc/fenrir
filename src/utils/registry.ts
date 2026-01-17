import fs from "fs";
import path from "path";
import type { Command, Event } from "../interfaces";
import Client from "../structures/Client"
import {fileAndDirNames, log} from "./utils";
import { pathToFileURL } from 'url'
import config from "../../config/config.json";

async function registerCommands(client: Client, ...dirs: string[]) {

    for (const dir of dirs) {
        const files = await fs.promises.readdir(dir);
        for (let file of files) {
            const filePath = path.join(dir, file);
            const stat = await fs.promises.lstat(filePath);
            if (stat.isDirectory()) await registerCommands(client, filePath);
            else {
                if (file.endsWith(".ts")) {
                    try {
                        const cmdModule = (
                            await import(pathToFileURL(filePath).href)).default;
                        const { name, run, guildId } = cmdModule;

                        if (!name) {
                            log("WARNING", "src/registry.ts", `The command '${filePath}' doesn't have a name`);
                            continue;
                        }

                        if (!run) {
                            log("WARNING", "src/registry.ts", `The command '${name}' doesn't have an run function`
                            );
                            continue;
                        }

                        if (client.commands.has(name)) {
                            log("WARNING", "src/registry.ts", `The command name '${name}' has already been added.`);
                            continue;
                        }

                        if(guildId !== config.devGuild){
                            client.nodevcommands.set(name, cmdModule);
                        }
                        client.commands.set(name, cmdModule);

                    } catch (e) {
                        // @ts-ignore
                        log("ERROR", "src/registry.ts", `Error loading commands: ${e.message}`);
                    }
                }
            }
        }
    }
}

async function registerEvents(client: Client, dir: string) {
    const files = await fs.promises.readdir(dir);
    for (let file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.promises.lstat(filePath);
        if (stat.isDirectory()) await registerEvents(client, filePath);
        else {
            if (file.endsWith(".ts")) {
                try {
                    const eventModule = (
                        await import(pathToFileURL(filePath).href)).default;
                    const { name } = eventModule;
                    client.events.set(name, eventModule);
                    client.on(name, eventModule.run.bind(null, client));

                } catch (e) {
                    // @ts-ignore
                    log("ERROR","src/registry.ts",`Error loading events: ${e.message}`);
                }
            }
        }
    }
}

export { registerEvents, registerCommands };