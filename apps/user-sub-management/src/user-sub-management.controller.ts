import { Controller, Get } from '@nestjs/common';
import { UserSubManagementService } from './user-sub-management.service';

@Controller()
export class UserSubManagementController {
  constructor(private readonly userSubManagementService: UserSubManagementService) {}

  @Get()
  getHello(): string {
    return this.userSubManagementService.getHello();
  }
}
