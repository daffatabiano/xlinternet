import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsArray, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePackageDto {
  @ApiProperty() @IsString() @MinLength(2) name: string;
  @ApiPropertyOptional() @IsString() @IsOptional() slug?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiProperty() @IsNumber() @Min(1) @Type(() => Number) speed: number;
  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) price: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() @Type(() => Number) installationFee?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() @Type(() => Number) contractMonths?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() quota?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() @Type(() => Number) latency?: number;
  @ApiPropertyOptional() @IsArray() @IsOptional() features?: string[];
  @ApiPropertyOptional() @IsString() @IsOptional() category?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isFeatured?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isPopular?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isActive?: boolean;
  @ApiProperty() @IsString() providerId: string;
}
