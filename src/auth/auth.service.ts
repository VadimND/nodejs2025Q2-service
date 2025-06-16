import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private salt: number;
  constructor(private userService: UserService, private jwtService: JwtService) {
    this.salt = parseInt(process.env.CRYPT_SALT);
  }

  async signup(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    try {
      const hashPassword = await bcrypt.hash(password, this.salt);
      const { id } = await this.userService.create({
        login,
        password: hashPassword,
      });
      return { id, message: 'User registered successfully!' };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async login(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    const user = await this.userService.findByLogin(login);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getToken(user.id, login);
    return tokens;
  }

  async refresh(token: string) {
    if (!token) throw new UnauthorizedException('Refresh token is not valid');
    try {
      const { userId, login } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      return await this.getToken(userId, login);
    } catch (error) {
      throw new ForbiddenException('Refresh token is not valid');
    }
  }

  private async getToken(userId: string, login: string) {
    const payload = { userId, login };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
  }
}
