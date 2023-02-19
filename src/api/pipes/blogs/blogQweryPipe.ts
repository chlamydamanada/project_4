import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { sortingDirection } from '../../../helpers/sortingDerection';

export class BlogQweryPipe {
  @IsOptional()
  searchNameTerm: string | null;

  @IsOptional()
  @IsNumber()
  pageNumber = 1;

  @IsOptional()
  @IsNumber()
  pageSize = 10;

  @IsOptional()
  sortBy = 'createdAt';

  @IsOptional()
  @Transform(({ value }) => sortingDirection(value))
  sortDirection = -1;
}
