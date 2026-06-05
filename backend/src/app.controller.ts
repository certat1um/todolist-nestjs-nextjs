import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('healthcheck')
@Controller()
export class AppController {
  @Get('/healthcheck')
  public async healthcheck() {
    return;
  }
}
