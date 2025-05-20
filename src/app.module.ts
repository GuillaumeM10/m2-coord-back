import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {GameModule} from './game/game.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                uri: `mongodb://${config.get<string>('MONGO_HOST')}:${config.get<string>('MONGO_PORT')}/${config.get<string>('MONGO_DB')}`,
            }),
        }),
        GameModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
