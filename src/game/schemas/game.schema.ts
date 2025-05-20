import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game {
    @Prop()
    name: string;

    @Prop()
    photoUrl: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);

GameSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
    },
});
