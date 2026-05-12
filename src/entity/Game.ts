import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id: number | undefined
    @Column("text")
    gameName: string;
    @Column("text")
    gameNumber: string;
    @Column("text")
    guildId: string;

    constructor(gameName: string, gameNumber: string, guildId: string) {
        this.gameName = gameName;
        this.gameNumber = gameNumber
        this.guildId = guildId
    }
}
