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
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const slugify_1 = __importDefault(require("slugify"));
let ProvidersService = class ProvidersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const { page = 1, limit = 20, type, city, minRating } = filters;
        const skip = (page - 1) * limit;
        const where = { isActive: true };
        if (type)
            where.type = type.toUpperCase();
        if (minRating)
            where.rating = { gte: minRating };
        if (city) {
            where.coverageAreas = { some: { city: { contains: city, mode: 'insensitive' }, isAvailable: true } };
        }
        const [data, total] = await Promise.all([
            this.prisma.provider.findMany({
                where, skip, take: limit,
                orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }],
                include: { coverageAreas: { take: 5 } },
            }),
            this.prisma.provider.count({ where }),
        ]);
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findFeatured() {
        return this.prisma.provider.findMany({
            where: { isFeatured: true, isActive: true },
            orderBy: { rating: 'desc' },
            take: 6,
            include: { coverageAreas: { take: 3 } },
        });
    }
    async findBySlug(slug) {
        const provider = await this.prisma.provider.findUnique({
            where: { slug },
            include: {
                coverageAreas: true,
                packages: { where: { isActive: true }, orderBy: { price: 'asc' } },
                reviews: { where: { isApproved: true }, orderBy: { createdAt: 'desc' }, take: 5 },
            },
        });
        if (!provider)
            throw new common_1.NotFoundException(`Provider "${slug}" tidak ditemukan`);
        return provider;
    }
    async findById(id) {
        const provider = await this.prisma.provider.findUnique({
            where: { id },
            include: { coverageAreas: true },
        });
        if (!provider)
            throw new common_1.NotFoundException(`Provider tidak ditemukan`);
        return provider;
    }
    async create(dto, logoPath) {
        const slug = dto.slug ?? (0, slugify_1.default)(dto.name, { lower: true, strict: true });
        const existing = await this.prisma.provider.findUnique({ where: { slug } });
        if (existing)
            throw new common_1.ConflictException(`Slug "${slug}" sudah digunakan`);
        return this.prisma.provider.create({
            data: {
                ...dto,
                slug,
                logo: logoPath,
                type: dto.type?.toUpperCase() ?? 'FIBER',
            },
        });
    }
    async update(id, dto, logoPath) {
        await this.findById(id);
        const data = { ...dto };
        if (logoPath)
            data.logo = logoPath;
        if (dto.type)
            data.type = dto.type.toUpperCase();
        return this.prisma.provider.update({ where: { id }, data });
    }
    async toggleActive(id) {
        const provider = await this.findById(id);
        return this.prisma.provider.update({
            where: { id },
            data: { isActive: !provider.isActive },
        });
    }
    async delete(id) {
        await this.findById(id);
        return this.prisma.provider.delete({ where: { id } });
    }
    async updateRating(providerId) {
        const agg = await this.prisma.review.aggregate({
            where: { providerId, isApproved: true },
            _avg: { rating: true },
            _count: { rating: true },
        });
        await this.prisma.provider.update({
            where: { id: providerId },
            data: {
                rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
                reviewCount: agg._count.rating,
            },
        });
    }
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map