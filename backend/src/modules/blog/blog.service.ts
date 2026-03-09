import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { IsOptional, IsNumber, IsString, IsArray, IsBoolean, Min, Max, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { PrismaService } from '../../config/prisma.service';
import slugify from 'slugify';

export class CreateBlogDto {
  @IsString() @MinLength(3) title: string;
  @IsOptional() @IsString() slug?: string;
  @IsString() @MinLength(10) excerpt: string;
  @IsString() @MinLength(20) content: string;
  @IsString() categoryId: string;
  @IsString() authorId: string;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsString() seoTitle?: string;
  @IsOptional() @IsString() seoDescription?: string;
  @IsOptional() @IsArray() seoKeywords?: string[];
  @IsOptional() @IsBoolean() isPublished?: boolean;
}

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}

export class BlogFilterDto {
  @IsOptional() @IsNumber() @Min(1) @Type(() => Number) page?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(100) @Type(() => Number) limit?: number;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() tag?: string;
}

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  private estimateReadTime(content: string): number {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  async findAll(filters: BlogFilterDto) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 10));
    const skip = (page - 1) * limit;
    const where: any = { isPublished: true };
    if (filters.category) where.category = { slug: filters.category };
    if (filters.tag) where.tags = { has: filters.tag };

    const [data, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          author:   { select: { id: true, name: true, avatar: true } },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findPublished(filters: BlogFilterDto) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 10));
    const skip = (page - 1) * limit;
    const where: any = { isPublished: true };
    if (filters.category) where.category = { slug: filters.category };

    const [data, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ publishedAt: 'desc' }],
        include: {
          category: true,
          author:   { select: { id: true, name: true, avatar: true } },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where:   { slug },
      include: {
        category: true,
        author:   { select: { id: true, name: true, avatar: true, email: true } },
      },
    });
    if (!post) throw new NotFoundException(`Artikel "${slug}" tidak ditemukan`);
    // Increment view count
    await this.prisma.blogPost.update({ where: { slug }, data: { viewCount: { increment: 1 } } });
    return post;
  }

  async findById(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where:   { id },
      include: { category: true, author: { select: { id: true, name: true } } },
    });
    if (!post) throw new NotFoundException('Artikel tidak ditemukan');
    return post;
  }

  async getRelated(id: string) {
    const post = await this.findById(id);
    return this.prisma.blogPost.findMany({
      where:   { isPublished: true, categoryId: post.categoryId, id: { not: id } },
      take:    3,
      orderBy: { publishedAt: 'desc' },
      include: { category: true, author: { select: { id: true, name: true } } },
    });
  }

  async create(dto: CreateBlogDto, imagePath?: string) {
    const slug = dto.slug ?? slugify(dto.title, { lower: true, strict: true });
    const existing = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (existing) throw new ConflictException(`Slug "${slug}" sudah digunakan`);

    return this.prisma.blogPost.create({
      data: {
        title:          dto.title,
        slug,
        excerpt:        dto.excerpt,
        content:        dto.content,
        featuredImage:  imagePath,
        categoryId:     dto.categoryId,
        authorId:       dto.authorId,
        tags:           dto.tags ?? [],
        readTime:       this.estimateReadTime(dto.content),
        seoTitle:       dto.seoTitle      ?? dto.title,
        seoDescription: dto.seoDescription ?? dto.excerpt,
        seoKeywords:    dto.seoKeywords   ?? [],
        isPublished:    dto.isPublished   ?? false,
        publishedAt:    dto.isPublished   ? new Date() : null,
      },
      include: { category: true, author: { select: { id: true, name: true } } },
    });
  }

  async update(id: string, dto: Partial<CreateBlogDto>, imagePath?: string) {
    await this.findById(id);
    const data: any = { ...dto };
    if (imagePath) data.featuredImage = imagePath;
    if (dto.content) data.readTime = this.estimateReadTime(dto.content);
    return this.prisma.blogPost.update({
      where:   { id },
      data,
      include: { category: true, author: { select: { id: true, name: true } } },
    });
  }

  async publish(id: string) {
    await this.findById(id);
    return this.prisma.blogPost.update({
      where: { id },
      data:  { isPublished: true, publishedAt: new Date() },
    });
  }

  async unpublish(id: string) {
    await this.findById(id);
    return this.prisma.blogPost.update({ where: { id }, data: { isPublished: false } });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.blogPost.delete({ where: { id } });
    return { deleted: true };
  }

  // Categories
  async getCategories() {
    return this.prisma.blogCategory.findMany({ orderBy: { name: 'asc' } });
  }

  async createCategory(name: string, description?: string, color?: string) {
    const slug = slugify(name, { lower: true, strict: true });
    return this.prisma.blogCategory.create({ data: { name, slug, description, color } });
  }
}
