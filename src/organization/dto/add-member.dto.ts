import { OrganizationRole } from "@devburst-io/burst-lib-commons";
import { IsEmail, IsEnum } from "class-validator";

export class AddMemberDto {
  @IsEmail()
  email: string;

  @IsEnum(OrganizationRole)
  role: OrganizationRole;
}
