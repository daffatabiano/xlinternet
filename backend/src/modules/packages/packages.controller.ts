import {
  Controller, Get, Post, Put, Delete,
  Param, Query, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackageFilterDto } from './dto/package-filter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('packages')
@Controller('packages')
export class PackagesController {
  constructor(private readonly service: PackagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all packages with filters' })
  findAll(@Query() filters: PackageFilterDto) {
    return this.service.findAll(filters);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured packages' })
  findFeatured() {
    return this.service.findFeatured();
  }

  @Get('provider/:providerId')
  @ApiOperation({ summary: 'Get packages by provider' })
  findByProvider(@Param('providerId') providerId: string) {
    return this.service.findByProvider(providerId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get package by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get package by ID' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create package (admin)' })
  create(@Body() dto: CreatePackageDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update package (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdatePackageDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete package (admin)' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
