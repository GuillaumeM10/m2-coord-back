import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MINIO_TOKEN } from './minio.decorator';
import * as Minio from 'minio';

@Global()
@Module({
  imports: [ConfigModule],
  exports: [MINIO_TOKEN],
  providers: [
    {
      inject: [ConfigService],
      provide: MINIO_TOKEN,
      useFactory: async (
        configService: ConfigService,
      ): Promise<Minio.Client> => {
        const client = new Minio.Client({
          endPoint: configService.get('MINIO_ENDPOINT') || 'localhost',
          port: +(configService.get('MINIO_PORT') || 9000),
          accessKey: configService.get('MINIO_ACCESS_KEY'),
          secretKey: configService.get('MINIO_SECRET_KEY'),
          useSSL: false,
        });

        return client;
      },
    },
  ],
})
export class MinioModule {}
