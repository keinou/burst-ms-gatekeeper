import { OrganizationMemberInterface, OrganizationRole } from "@devburst-io/burst-lib-commons";
import { ApiResponseProperty } from "@nestjs/swagger";
import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Organization } from "./organization.entity";

@Entity('organization_member')
export class OrganizationMember implements OrganizationMemberInterface {
  @ApiResponseProperty({
    type: String,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiResponseProperty({
    type: Organization,
  })
  @ManyToOne(() => Organization)
  organization: Organization

  @ApiResponseProperty({
    type: User,
  })
  @ManyToOne(() => User)
  user: User

  @ApiResponseProperty({
    type: OrganizationRole,
    enum: OrganizationRole
  })
  @Column({
    enum: OrganizationRole
  })
  role: OrganizationRole

  @ApiResponseProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiResponseProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiResponseProperty()
  @DeleteDateColumn()
  deletedAt: Date;
}
