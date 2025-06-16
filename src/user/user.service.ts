import { BadRequestException, NotFoundException, ForbiddenException, Injectable } from '@nestjs/common';
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

  async findByLogin(login: string) {
    const user = await this.prisma.user.findFirst({
      where: { login },
    });
    return user;
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
      throw new NotFoundException('User not found');
    }
    return this.userReturn(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { oldPassword, newPassword } = updateUserDto;
    if (!oldPassword) {
      throw new BadRequestException('Old password are required');
    }
    if (!newPassword) {
      throw new BadRequestException('New password are required');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Wrong old password');
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
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id } });
  }
}