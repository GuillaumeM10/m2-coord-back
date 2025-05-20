import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import {CreateGameDto, GameDto} from './dto/game.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

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
        return games.map(this.toGameDto);
    }

    @Get(':id')
    @ApiOkResponse({ type: GameDto })
    async findOne(@Param('id') id: string): Promise<GameDto> {
        const game = await this.gameService.findOne(id);
        return this.toGameDto(game);
    }

    @Delete(':id')
    @ApiOkResponse({ type: GameDto })
    async delete(@Param('id') id: string): Promise<GameDto> {
        const game = await this.gameService.delete(id);
        return this.toGameDto(game);
    }

    private toGameDto(game: any): GameDto {
        return {
            id: game.id ?? game._id.toString(),
            name: game.name,
            photoUrl: game.photoUrl,
        };
    }
}
