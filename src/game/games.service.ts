import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Game, GameDocument} from './schemas/game.schema';

@Injectable()
export class GamesService {
    constructor(
        @InjectModel(Game.name) private gameModel: Model<GameDocument>
    ) {
    }

    async create(data: Partial<Game>): Promise<Game> {
        const game = new this.gameModel(data);
        return game.save();
    }

    async findAll(): Promise<Game[]> {
        return this.gameModel.find().exec();
    }

    async findOne(id: string): Promise<Game | null> {
        return this.gameModel.findById(id).exec();
    }

    async delete(id: string): Promise<Game | null> {
        return this.gameModel.findByIdAndDelete(id).exec();
    }
}
