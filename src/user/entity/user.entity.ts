import { ApiResponseProperty } from "@nestjs/swagger";
import { hash } from "bcrypt";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, Min } from "class-validator";
import { Role } from "src/enums/role.enum";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { UserInterface } from "../interface/user.interface";

@Entity({
  name: "user",
})
@Unique(['email'])
export class User implements UserInterface {
  @ApiResponseProperty({
    type: String,
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsEmail()
  @Expose({ groups: ['me', 'admin'] })
  @ApiResponseProperty({
    type: String,
    example: 'foo.bar@example.com',
  })
  // https://github.com/typeorm/typeorm/issues/2567
  email!: string | null;

  @Column()
  @Exclude({ toPlainOnly: true })
  @Min(8)
  password!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: Role, default: Role.Common })
  role: Role;

  @ApiResponseProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiResponseProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiResponseProperty()
  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

}
