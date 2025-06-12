import { Module } from '@nestjs/common';
import { InitDataService } from './initData.service';

@Module({
  imports: [],
  providers: [InitDataService],
  controllers: [],
})
export class InitDataModule {}
