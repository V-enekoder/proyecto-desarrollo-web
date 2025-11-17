import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request as RequestType } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { UserJwtPayload } from "../users/user.entity.js";
import { UsersService } from "../users/users.service.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService)
    configService: ConfigService,
    @Inject(UsersService)
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("AUTH_SECRET"),
    });
  }

  private static extractJWT(req: RequestType): string | null {
    if (req.cookies.auth_token) return req.cookies.auth_token;
    return null;
  }

  async validate(payload: UserJwtPayload) {
    const user = await this.usersService.findOne(payload.sub);

    if (!user) return null;

    return user.toDTO();
  }
}
