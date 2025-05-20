import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class CreateGameDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    photoUrl: string;
}

export class GameDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    photoUrl: string;
}
