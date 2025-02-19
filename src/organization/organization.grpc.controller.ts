import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrganizationService } from './organization.service';

@Controller()
export class OrganizationGrpcController {
  constructor(private readonly organizationService: OrganizationService) { }

  @GrpcMethod('OrganizationService', 'ValidateOrganization')
  async validateOrganization(data: { id: string, userId: string }) {
    return {
      valid: await this.organizationService.validateMembership(data.userId, data.id)
    };
  }

  @GrpcMethod('OrganizationService', 'GetUserOrganizations')
  async getUserOrganizations(data: { userId: string, page: number, pageSize: number }) {
    const { items, page, pageSize, pageCount } = await this.organizationService.getUserOrganizations(
      { id: data.userId } as any,
      data.page,
      data.pageSize
    );

    return {
      items: items.map(org => ({
        id: org.id,
        name: org.name,
        description: org.description,
        members: org.members.map(member => ({
          userId: member.user.id,
          role: member.role
        }))
      })),
      page,
      pageSize,
      pageCount
    };
  }
}
