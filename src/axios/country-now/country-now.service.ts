import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AxiosInstance, AxiosResponse, isAxiosError } from 'axios';
import { AXIOS_TOKENS } from '../axios.contants';

@Injectable()
export class CountryNowService {
  #logger = new Logger(CountryNowService.name);

  constructor(
    @Inject(AXIOS_TOKENS.COUNTRY_NOW)
    private readonly countryNowAxiosInstance: AxiosInstance,
  ) {}

  private buildError(error: Error | AxiosResponse | HttpException) {
    if (error instanceof HttpException) {
      return error;
    }

    if (isAxiosError(error)) {
      return new HttpException(
        error?.response?.data?.message || 'Unexpected error occurred',
        error?.response?.status || HttpStatus.BAD_REQUEST,
      );
    }

    return new BadGatewayException('CountryNow API is unavailable');
  }
}
