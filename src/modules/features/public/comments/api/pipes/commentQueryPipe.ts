import { IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CommentQueryPipe {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageNumber = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize = 10;

  @IsOptional()
  sortBy = 'createdAt';

  @IsOptional()
  @Transform(({ value }) => sortingDirection(value))
  sortDirection = -1;
}

const sortingDirection = (value: string): 1 | -1 => {
  return value ? (value === 'asc' ? 1 : -1) : -1;
};
