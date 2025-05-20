import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {GameModes} from "../enum/gameModes.enum";

export type GameDocument = HydratedDocument<Game>;

@Schema({versionKey: false})
export class Game {
    @Prop()
    name: string;

    @Prop()
    photoUrl: string;

    @Prop()
    modes: GameModes[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
