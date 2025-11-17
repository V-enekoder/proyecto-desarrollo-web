import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum RoleEnum {
  USER = "user",
  ADMIN = "admin",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { unique: true, nullable: false })
  username: string;

  @Column("text", { unique: true, nullable: false })
  email: string;

  @Column("text", { nullable: false })
  @Exclude()
  password: string;

  @Column("text")
  name: string;

  @Column("text", {
    default: RoleEnum.USER,
    nullable: false,
  })
  role: RoleEnum;

  @BeforeInsert()
  async hashPassword() {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJwtPayload(): UserJwtPayload {
    return {
      sub: this.id,
      username: this.username,
      role: this.role,
    };
  }

  toDTO() {
    const { password: _, ...result } = this;
    return result;
  }
}

export interface UserJwtPayload {
  sub: string;
  username: string;
  role: RoleEnum;
}
