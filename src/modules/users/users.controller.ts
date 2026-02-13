import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { NationalityType } from '../auth/entities/NationalityType';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  me(@ActiveUserId() userId: string) {
    return this.usersService.getUserById(userId);
  }

  @Get()
  findAll(
    @Query('nationality') nationality?: NationalityType,
    @Query('document') document?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.usersService.findAll({
      nationality,
      document,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  }
}
