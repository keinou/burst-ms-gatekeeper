import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginetedResponse } from 'src/util/model/paginated.response.model';
import { InsertResult, Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async findAll(page, pageSize): Promise<PaginetedResponse<User>> {
    const query = this.userRepository.createQueryBuilder();
    query
      .select()
      .orderBy('"createdAt"', "ASC")
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const result = (await query.getRawAndEntities()).entities;

    return new PaginetedResponse<User>({
      items: result,
      page: page,
      pageSize: pageSize,
      itemCount: await query.getCount()
    });
  }

  async findOne(username: String): Promise<Partial<User>> {
    const user = await this.userRepository
      .createQueryBuilder()
      .addSelect("User.password")
      .where("User.username = :username", { username })
      .getOne()

    return user;
  }

  async createUser(user: any): Promise<InsertResult> {
    try {
      const userEntity = this.userRepository.create(user);
      const res = await this.userRepository.insert(userEntity);

      Logger.log('createUser - Created user');

      return res;
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  async vai() {
    const user = new User();
    user.name = 'admin';
    user.email = '';
    user.password = 'admin';
    user.username = 'admin';

    await this.userRepository.insert(
      this.userRepository.create(user)
    );
  }
}