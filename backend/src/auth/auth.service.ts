import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/user.entity.js";
import { UsersService } from "../users/users.service.js";
import { SignInDto, SignUpDto } from "./auth.dto.js";

@Injectable()
export class AuthService {
  private readonly authSecret: string;

  constructor(
    configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.authSecret = configService.getOrThrow<string>("AUTH_SECRET");
  }

  async login(signInDto: SignInDto) {
    const user = await this.usersService.findOneByUsername(signInDto.username);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isValid = await user.validatePassword(signInDto.password);

    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return {
      access_token: await this.jwtService.signAsync(user.toJwtPayload()),
      user: user.toDTO(),
    };
  }

  async register(signUpDto: SignUpDto) {
    const user = await this.usersService.create(signUpDto);

    return {
      access_token: await this.jwtService.signAsync(user.toJwtPayload()),
      user,
    };
  }

  async createToken(user: User) {
    return this.jwtService.signAsync(user.toJwtPayload(), {
      secret: this.authSecret,
    });
  }
}
