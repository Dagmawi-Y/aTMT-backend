import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentGenerationService {
  getHello(): string {
    return 'Hello World!';
  }
}
