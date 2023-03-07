import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { sortingDirection } from '../../../../../../helpers/helperFunctions/sortingDerection';

export class BannedUserQueryDtoPipe {
  @IsString()
  @IsOptional()
  searchLoginTerm: string | undefined;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  pageNumber = 1;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  pageSize = 10;

  @IsString()
  @IsOptional()
  sortBy = 'banDate';

  @IsOptional()
  @Transform(({ value }) => sortingDirection(value))
  sortDirection = -1;
}
