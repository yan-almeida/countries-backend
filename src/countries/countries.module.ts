import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
