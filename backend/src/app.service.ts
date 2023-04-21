import { Injectable } from '@nestjs/common';
import { ExampleDto } from './api/example.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  postHello(exampleDto: ExampleDto) {
    return {
      success: true,
    };
  }
}
