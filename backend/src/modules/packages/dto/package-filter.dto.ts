import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PackageFilterDto {
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) limit?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() providerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) minPrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) maxPrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) minSpeed?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) maxSpeed?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) contractMonths?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() sortBy?: 'price' | 'speed' | 'popular';
}
