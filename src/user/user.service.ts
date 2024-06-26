import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import generator from 'generate-password-ts';
import { PaginetedResponse } from 'src/util/model/paginated.response.model';
import { ObjectLiteral, QueryFailedError, Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService
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

  async findOne(username: string): Promise<Partial<User>> {
    const user = await this.userRepository
      .createQueryBuilder()
      .addSelect("User.password")
      .where("User.username = :username", { username })
      .getOne()

    return user;
  }

  async create(user: Partial<User>): Promise<ObjectLiteral> {
    try {
      const existingUser = await this.userRepository.findOne(
        {
          where: [
            { username: user.username },
            { email: user.email }
          ]
        }
      );
      if (existingUser) {
        throw new ConflictException('Username/Email already exists');
      }

      const userEntity = this.userRepository.create(user);
      const res = await this.userRepository.insert(userEntity);

      return res.generatedMaps[0];
    } catch (e) {
      if (e instanceof QueryFailedError) {
        if (e.message.includes('duplicate key value violates unique constraint "username"')) {
          throw new ConflictException('Username already exists');
        }
        if (e.message.includes('duplicate key value violates unique constraint "email"')) {
          throw new ConflictException('Email already exists');
        }
      }
      Logger.error(e);
      throw e;
    }
  }

  async resetPassword(userId: string, user: Partial<User>): Promise<Partial<User>> {
    try {
      const resp = await this.userRepository.findOne({ where: { id: userId } });
      if (!resp) {
        throw new NotFoundException('User not found');
      }

      resp.password = user.password;
      const updatedUser = await this.userRepository.save(resp);
      return { ...updatedUser, password: undefined }
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }

  async passwordForgot(usernameOrEmail: string): Promise<Partial<User>> {
    try {
      const user = await this.userRepository.findOne(
        {
          where: [
            { username: usernameOrEmail },
            { email: usernameOrEmail }
          ]
        }
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const password = generator.generate({
        length: 15,
        numbers: true
      });

      user.password = password

      this.mailerService
        .sendMail({
          to: user.email,
          from: 'rafael@karc.io',
          subject: 'Password Reset',
          html: `<b>Your new password is ${password} </b>`,
        }).catch((e) => { Logger.error(`Mailer => ${e}`) });

      const updatedUser = await this.userRepository.save(user)
      return { ...updatedUser, password: undefined }
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }
}
