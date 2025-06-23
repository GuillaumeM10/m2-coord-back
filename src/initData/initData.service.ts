import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizzData } from 'src/country/schemas/quizzdata.schema';
import { QuizzDataFigures } from 'src/figures/schemas/quizzdata.schema';
import { Game } from 'src/game/schemas/game.schema';
import flagsData from './jsonData/flags.json';
import figuresData from './jsonData/historical-figures.json';
import gamesData from './jsonData/games.json';

@Injectable()
export class InitDataService implements OnModuleInit {
  private readonly logger = new Logger(InitDataService.name);

  constructor(
    @InjectModel(QuizzData.name) private countryModel: Model<QuizzData>,
    @InjectModel(QuizzDataFigures.name)
    private figureModel: Model<QuizzDataFigures>,
    @InjectModel(Game.name) private gameModel: Model<Game>, // Add Game model
  ) {}

  async onModuleInit() {
    await this.initializeData();
  }

  async initializeData() {
    await this.initFlagData();
    await this.initFigureData();
    await this.initGamesData(); // Add this line
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
        // Check if flagsData is an array before proceeding
        if (!Array.isArray(flagsData)) {
          this.logger.error('Flag data is not an array!');
          return;
        }

        // Process flag data in batches to avoid overloading
        const validFlags = flagsData
          .filter((flag) => flag.type === 'flag' && flag.name && flag.flagSvg)
          .map((flag) => ({
            ...flag,
            type: 'flag',
          }));

        // If we have valid flags, insert them using the model
        if (validFlags.length > 0) {
          await this.countryModel.insertMany(validFlags);
          this.logger.log(
            `Successfully initialized ${validFlags.length} flags`,
          );
        } else {
          this.logger.warn('No valid flag data found in JSON file');
        }
      } catch (error) {
        this.logger.error('Failed to initialize flag data', error.stack);
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
        // Check if figuresData is an array before proceeding
        if (!Array.isArray(figuresData)) {
          this.logger.error('Figure data is not an array!');
          return;
        }

        // Transform figure data according to the schema requirements
        const validFigures = figuresData
          .filter(
            (figure) =>
              figure.answer && figure.question && figure.type === 'figure',
          )
          .map((figure) => ({
            question: figure.question,
            answer: figure.answer,
            type: 'figure',
            name: figure.answer,
            code: figure.answer.substring(0, 2).toUpperCase(),
          }));

        if (validFigures.length > 0) {
          await this.figureModel.insertMany(validFigures);
          this.logger.log(
            `Successfully initialized ${validFigures.length} historical figures`,
          );
        } else {
          this.logger.warn('No valid figure data found in JSON file');
        }
      } catch (error) {
        this.logger.error('Failed to initialize figure data', error.stack);
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
        // Check if gamesData is an array before proceeding
        if (!Array.isArray(gamesData)) {
          this.logger.error('Games data is not an array!');
          return;
        }

        // Process games data - remove MongoDB specific _id format
        const validGames = gamesData.map((game) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _id, ...gameData } = game;
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
      } catch (error) {
        this.logger.error('Failed to initialize games data', error.stack);
      }
    } else {
      this.logger.log(
        `Found ${gameCount} games in database. Skipping initialization.`,
      );
    }
  }
}
