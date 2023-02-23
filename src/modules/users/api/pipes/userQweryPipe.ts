import { IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { sortingDirection } from '../../../../helpers/helperFunctions/sortingDerection';

export class UserQweryPipe {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  pageNumber = 1;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
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
