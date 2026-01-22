import WerewolfClient from '../structures/Client'
import type {ClientEvents} from 'discord.js'

export type EventRun = (client: WerewolfClient, ...args: any[]) => any

export interface Event {
    name: keyof ClientEvents
    run: EventRun
}