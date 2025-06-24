import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizzData } from 'src/country/schemas/quizzdata.schema';
import { QuizzDataFigures } from 'src/figures/schemas/quizzdata.schema';
import { Game } from 'src/game/schemas/game.schema';
import flagsData from './jsonData/flags.json';
import figuresData from './jsonData/historical-figures.json';
import gamesData from './jsonData/games.json';

interface RawFigure {
  image: string;
  name: string;
  type?: string;
}

@Injectable()
export class InitDataService implements OnModuleInit {
  private readonly logger = new Logger(InitDataService.name);

  constructor(
    @InjectModel(QuizzData.name) private countryModel: Model<QuizzData>,
    @InjectModel(QuizzDataFigures.name)
    private figureModel: Model<QuizzDataFigures>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
  ) {}

  async onModuleInit() {
    await this.initializeData();
  }

  async initializeData() {
    await this.initFlagData();
    await this.initFigureData();
    await this.initGamesData();
  }

  private async initFlagData() {
    const countryCount = await this.countryModel
      .countDocuments({ type: 'flag' })
      .exec();

    if (countryCount === 0) {
      this.logger.log(
        'No flag data found in database. Initializing from JSON...',
      );

      try {
        if (!Array.isArray(flagsData)) {
          this.logger.error('Flag data is not an array!');
          return;
        }

        const validFlags = flagsData
          .filter((flag) => flag.type === 'flag' && flag.name && flag.flagSvg)
          .map((flag) => ({
            ...flag,
            type: 'flag',
          }));

        if (validFlags.length > 0) {
          await this.countryModel.insertMany(validFlags);
          this.logger.log(
            `Successfully initialized ${validFlags.length} flags`,
          );
        } else {
          this.logger.warn('No valid flag data found in JSON file');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.logger.error('Failed to initialize flag data', error.stack);
        } else {
          this.logger.error(
            'Failed to initialize flag data with an unknown error',
            error,
          );
        }
      }
    } else {
      this.logger.log(
        `Found ${countryCount} flags in database. Skipping initialization.`,
      );
    }
  }

  private async initFigureData() {
    const figureCount = await this.figureModel
      .countDocuments({ type: 'figure' })
      .exec();

    if (figureCount === 0) {
      this.logger.log(
        'No figure data found in database. Initializing from JSON...',
      );

      try {
        if (!Array.isArray(figuresData)) {
          this.logger.error('Figure data is not an array!');
          return;
        }

        const rawFigures = figuresData as RawFigure[];

        const validFigures = rawFigures
          .filter(
            (figure) => figure.name && figure.image && figure.type === 'figure',
          )
          .map((figure) => ({
            image: figure.image,
            name: figure.name,
            type: 'figure',
            code: figure.name.substring(0, 2).toUpperCase(),
          }));

        if (validFigures.length > 0) {
          await this.figureModel.insertMany(validFigures);
          this.logger.log(
            `Successfully initialized ${validFigures.length} historical figures`,
          );
        } else {
          this.logger.warn('No valid figure data found in JSON file');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.logger.error('Failed to initialize figure data', error.stack);
        } else {
          this.logger.error(
            'Failed to initialize figure data with an unknown error',
            error,
          );
        }
      }
    } else {
      this.logger.log(
        `Found ${figureCount} figures in database. Skipping initialization.`,
      );
    }
  }

  private async initGamesData() {
    const gameCount = await this.gameModel.countDocuments().exec();

    if (gameCount === 0) {
      this.logger.log('No games found in database. Initializing from JSON...');

      try {
        if (!Array.isArray(gamesData)) {
          this.logger.error('Games data is not an array!');
          return;
        }

        const validGames = gamesData.map((game) => {
          const { ...gameData } = game;
          return gameData;
        });

        if (validGames.length > 0) {
          await this.gameModel.insertMany(validGames);
          this.logger.log(
            `Successfully initialized ${validGames.length} games`,
          );
        } else {
          this.logger.warn('No valid games found in JSON file');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.logger.error('Failed to initialize games data', error.stack);
        } else {
          this.logger.error(
            'Failed to initialize games data with an unknown error',
            error,
          );
        }
      }
    } else {
      this.logger.log(
        `Found ${gameCount} games in database. Skipping initialization.`,
      );
    }
  }
}
