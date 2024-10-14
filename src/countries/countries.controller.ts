import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getAvailableCountries() {
    try {
      return this.countriesService.getAvailableCountries();
    } catch (error) {
      throw new HttpException(
        `Failed to fetch available countries: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':code')
  async getCountryInfo(@Param('code') code: string) {
    return this.countriesService.getCountryInfo(code);
  }
}
