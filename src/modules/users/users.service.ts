import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { NationalityType } from '../auth/entities/NationalityType';

type UsersQuery = {
  nationality?: NationalityType | undefined;
  document?: string | undefined;
  page?: number;
  limit?: number;
};

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  getUserById(userId: string) {
    return this.usersRepo.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        document: true,
        nationality: true,
      },
    });
  }

  async findAll(params?: UsersQuery) {
    const where = {
      nationality: params?.nationality,
      document: params?.document,
    };

    const [data, totalCount] = await Promise.all([
      this.usersRepo.findMany({
        where,
        skip: (params.page - 1) * params.limit || undefined,
        take: params.limit || undefined,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          nationality: true,
          document: true,
          createdAt: true,
          updatedAt: true,
        },
      }),

      this.usersRepo.count({ where }),
    ]);

    return { data, totalCount };
  }
}
