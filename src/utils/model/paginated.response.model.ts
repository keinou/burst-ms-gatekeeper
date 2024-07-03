import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber } from "class-validator";

export class PaginetedResponse<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly items: T[];

  @IsNumber()
  @ApiProperty({ type: 'number' })
  readonly page: number;

  @IsNumber()
  @ApiProperty({ type: 'number' })
  readonly pageSize: number;

  @IsNumber()
  @ApiProperty({ type: 'number' })
  readonly pageCount: number;

  @IsBoolean()
  @ApiProperty({ type: 'boolean' })
  readonly hasNext: boolean;

  @IsBoolean()
  @ApiProperty({ type: 'boolean' })
  readonly hasPrevious: boolean;

  constructor({ items, page, pageSize, itemCount }) {
    this.items = items;
    this.page = page;
    this.pageSize = (pageSize + items.length) - pageSize;
    this.pageCount = Math.ceil(itemCount / pageSize);
    this.hasNext = this.page < this.pageCount;
    this.hasPrevious = this.page > 1;
  }
}