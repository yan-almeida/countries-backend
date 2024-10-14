import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class CountriesService {
  private readonly nagerApiUrl: string;
  private readonly populationApiUrl: string;
  private readonly flagApiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.nagerApiUrl = this.configService.get<string>('NAGER_API_URL');
    this.populationApiUrl = this.configService.get<string>(
      'COUNTRIES_POPULATION_API_URL',
    );
    this.flagApiUrl = this.configService.get<string>('COUNTRIES_FLAG_API_URL');
  }

  async getAvailableCountries() {
    try {
      const response = await axios.get(
        `${this.nagerApiUrl}/AvailableCountries`,
      );
      return response.data;
    } catch {
      throw new HttpException(
        'Failed to fetch available countries.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getCountryInfo(code: string) {
    try {
      const countryInfoResponse = await axios.get(
        `${this.nagerApiUrl}/CountryInfo/${code}`,
      );
      const countryInfo = countryInfoResponse.data;

      if (!countryInfo) {
        throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
      }

      const populationResponse = await axios.post(this.populationApiUrl, {
        country: countryInfo.commonName,
      });

      const populationData = populationResponse.data.data;
      if (!populationData) {
        throw new HttpException(
          'Failed to fetch population data',
          HttpStatus.NOT_FOUND,
        );
      }

      const flagResponse = await axios.post(this.flagApiUrl, {
        country: countryInfo.commonName,
      });

      const flagData = flagResponse.data.data;
      if (!flagData?.flag) {
        throw new HttpException(
          'Failed to fetch flag URL',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        name: countryInfo.commonName,
        borders: countryInfo.borders,
        population: populationData,
        flagUrl: flagData.flag,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch country info.',
        error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
