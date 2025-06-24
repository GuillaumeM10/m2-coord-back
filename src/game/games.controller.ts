import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto, GameDto } from './dto/game.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GameDocument } from './schemas/game.schema';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @Post()
  @ApiCreatedResponse({ type: GameDto })
  async create(@Body() body: CreateGameDto): Promise<GameDto> {
    const game = await this.gameService.create(body);
    return this.toGameDto(game);
  }

  @Get()
  @ApiOkResponse({ type: [GameDto] })
  async findAll(): Promise<GameDto[]> {
    const games = await this.gameService.findAll();
    // TODO: Fix this line
    // eslint-disable-next-line
    return games.map(this.toGameDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: GameDto })
  async findOne(@Param('id') id: string): Promise<GameDto> {
    const game = await this.gameService.findOne(id);
    if (!game) {
      throw NotFoundException;
    }
    return this.toGameDto(game);
  }

  @Delete(':id')
  @ApiOkResponse({ type: GameDto })
  async delete(@Param('id') id: string): Promise<GameDto> {
    const game = await this.gameService.delete(id);
    if (!game) {
      throw NotFoundException;
    }
    return this.toGameDto(game);
  }

  private toGameDto(game: GameDocument): GameDto {
    return {
      id: game._id.toString(),
      key: game.key,
      name: game.name,
      photoUrl: game.photoUrl,
      modes: game.modes,
    };
  }
}
