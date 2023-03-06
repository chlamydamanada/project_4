import { IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { sortingDirection } from '../../../../../../helpers/helperFunctions/sortingDerection';

export class BannedUserQueryDtoPipe {
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

  @IsOptional()
  sortBy = 'banInfo.banDate';

  @IsOptional()
  @Transform(({ value }) => sortingDirection(value))
  sortDirection = -1;
}
