import { IsEnum } from "class-validator";
import { RoleEnum } from "@uneg-lab/api-types/auth.js";

export class ChangeUserRoleDto {
  @IsEnum(RoleEnum)
  role!: RoleEnum;
}
