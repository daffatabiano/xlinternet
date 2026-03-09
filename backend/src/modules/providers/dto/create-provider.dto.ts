import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsUrl, MinLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProviderDto {
  @ApiProperty() @IsString() @MinLength(2) name: string;
  @ApiPropertyOptional() @IsString() @IsOptional() slug?: string;
  @ApiProperty() @IsString() @MinLength(20) description: string;
  @ApiProperty() @IsString() @MinLength(5) tagline: string;
  @ApiProperty({ enum: ['fiber','wireless','cable','hybrid'] })
  @IsEnum(['fiber','wireless','cable','hybrid']) @IsOptional() type?: string;
  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) minPrice: number;
  @ApiProperty() @IsNumber() @Min(1) @Type(() => Number) maxSpeed: number;
  @ApiPropertyOptional() @IsUrl() @IsOptional() website?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() phone?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isFeatured?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isActive?: boolean;
}
