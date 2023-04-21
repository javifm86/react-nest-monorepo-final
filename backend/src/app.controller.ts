import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ExampleDto } from './api/example.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test')
  postHello(@Body() exampleDto: ExampleDto) {
    return this.appService.postHello(exampleDto);
  }
}
