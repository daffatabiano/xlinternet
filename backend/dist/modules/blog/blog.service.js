"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = exports.BlogFilterDto = exports.UpdateBlogDto = exports.CreateBlogDto = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const mapped_types_1 = require("@nestjs/mapped-types");
const prisma_service_1 = require("../../config/prisma.service");
const slugify_1 = __importDefault(require("slugify"));
class CreateBlogDto {
}
exports.CreateBlogDto = CreateBlogDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "excerpt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "authorId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateBlogDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "seoTitle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "seoDescription", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateBlogDto.prototype, "seoKeywords", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBlogDto.prototype, "isPublished", void 0);
class UpdateBlogDto extends (0, mapped_types_1.PartialType)(CreateBlogDto) {
}
exports.UpdateBlogDto = UpdateBlogDto;
class BlogFilterDto {
}
exports.BlogFilterDto = BlogFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BlogFilterDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BlogFilterDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BlogFilterDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BlogFilterDto.prototype, "tag", void 0);
let BlogService = class BlogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    estimateReadTime(content) {
        const words = content.trim().split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200));
    }
    async findAll(filters) {
        const page = Math.max(1, filters.page || 1);
        const limit = Math.min(100, Math.max(1, filters.limit || 10));
        const skip = (page - 1) * limit;
        const where = { isPublished: true };
        if (filters.category)
            where.category = { slug: filters.category };
        if (filters.tag)
            where.tags = { has: filters.tag };
        const [data, total] = await Promise.all([
            this.prisma.blogPost.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    category: true,
                    author: { select: { id: true, name: true, avatar: true } },
                },
            }),
            this.prisma.blogPost.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findPublished(filters) {
        const page = Math.max(1, filters.page || 1);
        const limit = Math.min(100, Math.max(1, filters.limit || 10));
        const skip = (page - 1) * limit;
        const where = { isPublished: true };
        if (filters.category)
            where.category = { slug: filters.category };
        const [data, total] = await Promise.all([
            this.prisma.blogPost.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ publishedAt: 'desc' }],
                include: {
                    category: true,
                    author: { select: { id: true, name: true, avatar: true } },
                },
            }),
            this.prisma.blogPost.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findBySlug(slug) {
        const post = await this.prisma.blogPost.findUnique({
            where: { slug },
            include: {
                category: true,
                author: { select: { id: true, name: true, avatar: true, email: true } },
            },
        });
        if (!post)
            throw new common_1.NotFoundException(`Artikel "${slug}" tidak ditemukan`);
        // Increment view count
        await this.prisma.blogPost.update({ where: { slug }, data: { viewCount: { increment: 1 } } });
        return post;
    }
    async findById(id) {
        const post = await this.prisma.blogPost.findUnique({
            where: { id },
            include: { category: true, author: { select: { id: true, name: true } } },
        });
        if (!post)
            throw new common_1.NotFoundException('Artikel tidak ditemukan');
        return post;
    }
    async getRelated(id) {
        const post = await this.findById(id);
        return this.prisma.blogPost.findMany({
            where: { isPublished: true, categoryId: post.categoryId, id: { not: id } },
            take: 3,
            orderBy: { publishedAt: 'desc' },
            include: { category: true, author: { select: { id: true, name: true } } },
        });
    }
    async create(dto, imagePath) {
        const slug = dto.slug ?? (0, slugify_1.default)(dto.title, { lower: true, strict: true });
        const existing = await this.prisma.blogPost.findUnique({ where: { slug } });
        if (existing)
            throw new common_1.ConflictException(`Slug "${slug}" sudah digunakan`);
        return this.prisma.blogPost.create({
            data: {
                title: dto.title,
                slug,
                excerpt: dto.excerpt,
                content: dto.content,
                featuredImage: imagePath,
                categoryId: dto.categoryId,
                authorId: dto.authorId,
                tags: dto.tags ?? [],
                readTime: this.estimateReadTime(dto.content),
                seoTitle: dto.seoTitle ?? dto.title,
                seoDescription: dto.seoDescription ?? dto.excerpt,
                seoKeywords: dto.seoKeywords ?? [],
                isPublished: dto.isPublished ?? false,
                publishedAt: dto.isPublished ? new Date() : null,
            },
            include: { category: true, author: { select: { id: true, name: true } } },
        });
    }
    async update(id, dto, imagePath) {
        await this.findById(id);
        const data = { ...dto };
        if (imagePath)
            data.featuredImage = imagePath;
        if (dto.content)
            data.readTime = this.estimateReadTime(dto.content);
        return this.prisma.blogPost.update({
            where: { id },
            data,
            include: { category: true, author: { select: { id: true, name: true } } },
        });
    }
    async publish(id) {
        await this.findById(id);
        return this.prisma.blogPost.update({
            where: { id },
            data: { isPublished: true, publishedAt: new Date() },
        });
    }
    async unpublish(id) {
        await this.findById(id);
        return this.prisma.blogPost.update({ where: { id }, data: { isPublished: false } });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.blogPost.delete({ where: { id } });
        return { deleted: true };
    }
    // Categories
    async getCategories() {
        return this.prisma.blogCategory.findMany({ orderBy: { name: 'asc' } });
    }
    async createCategory(name, description, color) {
        const slug = (0, slugify_1.default)(name, { lower: true, strict: true });
        return this.prisma.blogCategory.create({ data: { name, slug, description, color } });
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogService);
//# sourceMappingURL=blog.service.js.map