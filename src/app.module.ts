import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { MinioModule } from './minio/minio.module';
// import { FilesModule } from './files/files.module';
import { GamesModule } from './game/games.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CountryModule } from './country/country.module';
import { AnswerModule } from './answer/answer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { FigureModule } from './figures/figures.module';
import { InitDataModule } from './initData/initData.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MinioModule,
    // FilesModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        uri:
          process.env.MONGO_URI ??
          `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
      }),
    }),
    CountryModule,
    AnswerModule,
    FigureModule,
    GamesModule,
    InitDataModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
