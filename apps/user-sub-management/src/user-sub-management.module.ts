import { Module } from '@nestjs/common';
import { UserSubManagementController } from './user-sub-management.controller';
import { UserSubManagementService } from './user-sub-management.service';

@Module({
  imports: [],
  controllers: [UserSubManagementController],
  providers: [UserSubManagementService],
})
export class UserSubManagementModule {}
