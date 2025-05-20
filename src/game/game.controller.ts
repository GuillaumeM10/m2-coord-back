import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {GameService} from './game.service';
import {Game} from './schemas/game.schema';

@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) {
    }

    @Post()
    create(@Body() body: Partial<Game>) {
        return this.gameService.create(body);
    }

    @Get()
    findAll() {
        return this.gameService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.gameService.findOne(id);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.gameService.delete(id);
    }
}
