import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { UserRepository } from '../repository/User.repository';
import { UserCreateRequest } from '../request/UserCreate.request';
import { UserEntity } from './../models/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
  ) {}

  public async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  public async findByEmail(userEmail: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ email: userEmail });
  }

  public async findById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOneOrFail(id);
  }

  public async create(user: UserCreateRequest): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }

  public async update(
    id: number,
    newValue: UserCreateRequest,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneOrFail(id);
    if (!user.id) {
      // tslint:disable-next-line:no-console
      console.error("user doesn't exist");
    }
    await this.userRepository.update(id, newValue);
    return await this.userRepository.findOne(id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  public async register(userDto: UserCreateRequest): Promise<UserEntity> {
    const { email } = userDto;
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.create(userDto);
    return await this.userRepository.save(user);
  }
}
