import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Query, Body, UseGuards, UseInterceptors,
  UploadedFile, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BlogService, CreateBlogDto, UpdateBlogDto, BlogFilterDto } from './blog.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  // ── Public ────────────────────────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'Get all blog posts (admin)' })
  findAll(@Query() filters: BlogFilterDto) {
    return this.service.findAll(filters);
  }

  @Get('published')
  @ApiOperation({ summary: 'Get published blog posts' })
  findPublished(@Query() filters: BlogFilterDto) {
    return this.service.findPublished(filters);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get blog categories' })
  getCategories() {
    return this.service.getCategories();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get post by ID' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Get related posts' })
  getRelated(@Param('id') id: string) {
    return this.service.getRelated(id);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get post by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  // ── Admin (protected) ─────────────────────────────────────────────────────
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('featuredImage'))
  @ApiOperation({ summary: 'Create blog post' })
  create(
    @Body() dto: CreateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imagePath = file ? `/uploads/blog/${file.originalname}` : undefined;
    return this.service.create(dto, imagePath);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('featuredImage'))
  @ApiOperation({ summary: 'Update blog post' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imagePath = file ? `/uploads/blog/${file.originalname}` : undefined;
    return this.service.update(id, dto, imagePath);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish post' })
  publish(@Param('id') id: string) {
    return this.service.publish(id);
  }

  @Patch(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish post' })
  unpublish(@Param('id') id: string) {
    return this.service.unpublish(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete post' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blog category' })
  createCategory(@Body() body: { name: string; description?: string; color?: string }) {
    return this.service.createCategory(body.name, body.description, body.color);
  }
}
