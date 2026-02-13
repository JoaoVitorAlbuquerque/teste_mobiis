import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}
  create(createDto: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(createDto);
  }

  findMany<T extends Prisma.UserFindManyArgs>(
    findManyDto: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>,
  ) {
    return this.prismaService.user.findMany(findManyDto);
  }

  findUnique(findUniqueDto: Prisma.UserFindUniqueArgs) {
    return this.prismaService.user.findUnique(findUniqueDto);
  }

  findFirst(findFirstDto: Prisma.UserFindFirstArgs) {
    return this.prismaService.user.findFirst(findFirstDto);
  }
}
