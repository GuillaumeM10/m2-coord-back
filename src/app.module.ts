import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MinioModule } from './minio/minio.module';
import { FilesModule } from './files/files.module';
import { GamesModule } from './game/games.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MinioModule,
    FilesModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: `mongodb://${config.get<string>('MONGO_HOST')}:${config.get<string>('MONGO_PORT')}/${config.get<string>('MONGO_DB')}`,
      }),
    }),
    GamesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
