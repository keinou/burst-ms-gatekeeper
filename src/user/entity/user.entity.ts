import { hash } from "bcrypt";
import { IsEmail, Min } from "class-validator";
import { Role } from "src/enums/role.enum";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserInterface } from "../interface/user.interface";

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User implements UserInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username!: string;

  @Column({ select: false })
  @Min(8)
  password!: string;

  @Column()
  name!: string;

  @Column()
  @IsEmail()
  email!: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: Role, default: Role.Common })
  role: Role;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

}
