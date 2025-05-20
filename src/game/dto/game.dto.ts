import {ApiProperty} from '@nestjs/swagger';
import {ArrayNotEmpty, IsEnum, IsNotEmpty, IsString} from 'class-validator';
import {GameModes} from "../enum/gameModes.enum";

export class CreateGameDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    photoUrl: string;

    @ApiProperty({enum: GameModes, isArray: true})
    @ArrayNotEmpty()
    @IsEnum(GameModes, {each: true})
    modes: GameModes[];

}

export class GameDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    photoUrl: string;

    @ApiProperty({enum: GameModes, isArray: true})
    modes: GameModes[];
}
