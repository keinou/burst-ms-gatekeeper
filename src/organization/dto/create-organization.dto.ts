import { IsString, MinLength } from "class-validator";

export class CreateOrganizationDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    description: string;
}
