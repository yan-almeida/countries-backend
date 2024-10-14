import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CountryNowService } from '../axios/country-now/country-now.service';
import { NagerService } from '../axios/nager/nager.service';
import { CACHE_KEYS } from '../constants/cache.constants';

@Injectable()
export class CountriesService {
  #logger = new Logger(CountriesService.name);

  constructor(
    private readonly nagerService: NagerService,
    private readonly countryNowService: CountryNowService,
    @Inject(CACHE_MANAGER)
    private readonly cache,
  ) {}

  async getAvailableCountries() {
    const isCached = await this.cache.get(CACHE_KEYS.COUNTRIES);

    if (isCached?.length) {
      return isCached;
    }

    /**
     * TODO: validar se vai precisar transformar os dados pra um novo DTO - indico que sim, nesse caso, talvez nao, mas nos outros talve...
     */
    const countries = await this.nagerService.getAvailableCountries();

    await this.cache.set(CACHE_KEYS.COUNTRIES, countries);

    return countries;
  }

  async getCountryInfoByCode(countryCode: string) {
    const isCached = await this.cache.get(
      `${CACHE_KEYS.COUNTRY_CODE}/${countryCode}`,
    );

    if (isCached) {
      return isCached;
    }

    /**
     * TODO: validar se vai precisar transformar os dados pra um novo DTO
     */
    const countryInfo =
      await this.nagerService.getCountryInfoByCode(countryCode);

    await this.cache.set(
      `${CACHE_KEYS.COUNTRY_CODE}/${countryCode}`,
      countryInfo,
    );

    return countryInfo;
  }
}
