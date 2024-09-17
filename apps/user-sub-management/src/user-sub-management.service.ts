import { Injectable } from '@nestjs/common';

@Injectable()
export class UserSubManagementService {
  getHello(): string {
    return 'Hello World!';
  }
}
