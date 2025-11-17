import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Request as RequestType, Response as ResponseType } from "express";
import { ms } from "ms";
import { SignInDto, SignUpDto } from "./auth.dto.js";
import { AuthService } from "./auth.service.js";
import { JwtAuthGuard } from "./jwt-auth.guard.js";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const result = await this.authService.login(signInDto);

    this._setAuthCookie(res, result.access_token);

    return result;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async register(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const result = await this.authService.register(signUpDto);
    this._setAuthCookie(res, result.access_token);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post("logout")
  logout(@Res({ passthrough: true }) res: ResponseType) {
    this._removeAuthCookie(res);
    return { message: "ok" };
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req: RequestType) {
    return req.user;
  }

  private _setAuthCookie(res: ResponseType, accessToken: string): void {
    res.cookie("auth_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms("1h"),
    });
  }

  private _removeAuthCookie(res: ResponseType): void {
    res.clearCookie("auth_token");
  }
}
