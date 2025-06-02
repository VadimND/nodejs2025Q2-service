import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 } from 'uuid';
import { users } from 'src/memdb/memdb';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  userReturn(user: User) {
    const result = {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return result;
  }

  create(createUserDto: CreateUserDto) {
    const timestamp = Date.now();
    const newUser = {
      id: v4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    users.push(newUser);

    return this.userReturn(newUser);
  }

  findAll() {
    return users.map((user) => this.userReturn(user));
  }

  findOne(id: string) {
    const user = users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.userReturn(user);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const { oldPassword, newPassword } = updateUserDto;
    if (!oldPassword) {
      throw new HttpException(
        'Old password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!newPassword) {
      throw new HttpException(
        'New password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.password !== oldPassword) {
      throw new HttpException('Wrong old password', HttpStatus.FORBIDDEN);
    }

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return this.userReturn(user);
  }

  remove(id: string) {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    users.splice(index, 1);
  }
}
