import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "laboratories" })
export class Laboratory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false })
  name: string;

  @Column("int", { nullable: false })
  number: number;

  @Column("boolean", { default: true, nullable: false })
  active: boolean;
}
