import Discord, {ActivityType, Client, Collection, Partials} from "discord.js";
import type {Command, Event, GuildInfo} from "../interfaces";
import config from "../../config/config.json";
import {log} from "../utils/utils";
import { registerCommands, registerEvents } from "../utils/registry";

export default class WerewolfClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public nodevcommands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public guildInfoCache: Collection<Discord.Snowflake, GuildInfo> = new Collection();

    public constructor() {
        super({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMembers,
                Discord.GatewayIntentBits.GuildMessages
            ],
            presence: {
                status: 'idle',
                activities: [{ name: 'Looking for food', type: ActivityType.Playing }],
            },
            partials: [Partials.Message, Partials.Reaction, Partials.Channel],
        })
    }

    public async init(){

        await registerEvents(this, "src/events");
        await registerCommands(this, 'src/commands');

        try {
            await this.login(config.TOKEN);
            log("SUCCESS","Client.ts",`Logged in as ${this.user!.tag}`);
        } catch (e) {
            // @ts-ignore
            log("ERROR", "Client.ts", `Error logging in: ${e.message}`);
        }

        log("SUCCESS","Client.ts",`Added ${this.commands.size} commands, ${this.nodevcommands.size} devcommands and ${this.events.size} events`);

        this.on('modalSubmit', (modal) => {
            console.log(modal);
            log("SUCCESS", "Client.ts", "Modal has been submitted");
        })
    }
}