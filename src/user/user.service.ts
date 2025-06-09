import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  userReturn(user: User) {
    const result = {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: new Date(user.createdAt).getTime(),
      updatedAt: new Date(user.updatedAt).getTime(),
    };

    return result;
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: createUserDto });
    return this.userReturn(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.userReturn(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.userReturn(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.password !== oldPassword) {
      throw new HttpException('Wrong old password', HttpStatus.FORBIDDEN);
    }

    const updateData = {
      password: newPassword,
      version: user.version + 1,
    };

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return this.userReturn(updatedUser);
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({ where: { id } });
  }
}
