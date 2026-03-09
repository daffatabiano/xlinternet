import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Query, Body, UseGuards, UseInterceptors,
  UploadedFile, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor }  from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProvidersService }   from './providers.service';
import { CreateProviderDto }  from './dto/create-provider.dto';
import { UpdateProviderDto }  from './dto/update-provider.dto';
import { ProviderFilterDto }  from './dto/provider-filter.dto';
import { JwtAuthGuard }       from '../../common/guards/jwt-auth.guard';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly service: ProvidersService) {}

  // ── Public endpoints ──────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Get all providers with filters' })
  findAll(@Query() filters: ProviderFilterDto) {
    return this.service.findAll(filters);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured providers' })
  findFeatured() {
    return this.service.findFeatured();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get provider by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get provider by ID' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  // ── Admin endpoints (protected) ───────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ summary: 'Create new provider' })
  create(
    @Body() dto: CreateProviderDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const logoPath = file ? `/uploads/logos/${file.originalname}` : undefined;
    return this.service.create(dto, logoPath);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ summary: 'Update provider' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProviderDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const logoPath = file ? `/uploads/logos/${file.originalname}` : undefined;
    return this.service.update(id, dto, logoPath);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle provider active status' })
  toggleActive(@Param('id') id: string) {
    return this.service.toggleActive(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete provider' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
