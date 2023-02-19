import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { sortingDirection } from '../../../helpers/sortingDerection';

export class UserQweryPipe {
  @IsOptional()
  @IsNumber()
  pageNumber = 1;

  @IsOptional()
  @IsNumber()
  pageSize = 10;

  @IsOptional()
  searchLoginTerm: string | undefined;

  @IsOptional()
  searchEmailTerm: string | undefined;

  @IsOptional()
  sortBy = 'createdAt';

  @IsOptional()
  @Transform(({ value }) => sortingDirection(value))
  sortDirection = -1;
}
