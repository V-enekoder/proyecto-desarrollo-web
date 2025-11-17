import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class SignInDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class SignUpDto {
  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({ minSymbols: 0 })
  password: string;
}
