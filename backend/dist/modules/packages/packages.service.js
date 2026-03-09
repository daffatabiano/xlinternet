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
exports.PackagesService = void 0;
// packages.service.ts
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const slugify_1 = __importDefault(require("slugify"));
let PackagesService = class PackagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const { page = 1, limit = 20, providerId, category, minPrice, maxPrice, minSpeed, maxSpeed, contractMonths, sortBy = 'popular' } = filters;
        const skip = (page - 1) * limit;
        const where = { isActive: true };
        if (providerId)
            where.providerId = providerId;
        if (category)
            where.category = category.toUpperCase();
        if (contractMonths !== undefined)
            where.contractMonths = contractMonths;
        if (minPrice || maxPrice)
            where.price = { ...(minPrice && { gte: minPrice }), ...(maxPrice && { lte: maxPrice }) };
        if (minSpeed || maxSpeed)
            where.speed = { ...(minSpeed && { gte: minSpeed }), ...(maxSpeed && { lte: maxSpeed }) };
        const orderBy = sortBy === 'price' ? [{ price: 'asc' }] :
            sortBy === 'speed' ? [{ speed: 'desc' }] :
                [{ isPopular: 'desc' }, { isFeatured: 'desc' }, { price: 'asc' }];
        const [data, total] = await Promise.all([
            this.prisma.package.findMany({
                where, skip, take: limit, orderBy,
                include: { provider: { select: { id: true, name: true, slug: true, logo: true } } },
            }),
            this.prisma.package.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findFeatured() {
        return this.prisma.package.findMany({
            where: { isFeatured: true, isActive: true },
            take: 6,
            orderBy: [{ isPopular: 'desc' }, { price: 'asc' }],
            include: { provider: { select: { id: true, name: true, slug: true, logo: true } } },
        });
    }
    async findBySlug(slug) {
        const pkg = await this.prisma.package.findUnique({
            where: { slug },
            include: { provider: true },
        });
        if (!pkg)
            throw new common_1.NotFoundException(`Paket "${slug}" tidak ditemukan`);
        return pkg;
    }
    async findById(id) {
        const pkg = await this.prisma.package.findUnique({ where: { id }, include: { provider: true } });
        if (!pkg)
            throw new common_1.NotFoundException('Paket tidak ditemukan');
        return pkg;
    }
    async findByProvider(providerId) {
        return this.prisma.package.findMany({
            where: { providerId, isActive: true },
            orderBy: { price: 'asc' },
        });
    }
    async create(dto) {
        const slug = dto.slug ?? (0, slugify_1.default)(dto.name, { lower: true, strict: true });
        const existing = await this.prisma.package.findUnique({ where: { slug } });
        if (existing)
            throw new common_1.ConflictException(`Slug "${slug}" sudah digunakan`);
        return this.prisma.package.create({
            data: {
                name: dto.name,
                slug,
                description: dto.description,
                speed: dto.speed,
                price: dto.price,
                installationFee: dto.installationFee ?? 0,
                contractMonths: dto.contractMonths ?? 0,
                quota: dto.quota ?? 'unlimited',
                latency: dto.latency ?? 20,
                features: dto.features ?? [],
                category: (dto.category?.toUpperCase() ?? 'STANDARD'),
                isFeatured: dto.isFeatured ?? false,
                isPopular: dto.isPopular ?? false,
                isActive: dto.isActive ?? true,
                providerId: dto.providerId,
            },
            include: { provider: { select: { id: true, name: true, slug: true } } },
        });
    }
    async update(id, dto) {
        await this.findById(id);
        const data = { ...dto };
        if (dto.category)
            data.category = dto.category.toUpperCase();
        return this.prisma.package.update({
            where: { id },
            data,
            include: { provider: { select: { id: true, name: true, slug: true } } },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.package.delete({ where: { id } });
        return { deleted: true };
    }
};
exports.PackagesService = PackagesService;
exports.PackagesService = PackagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PackagesService);
//# sourceMappingURL=packages.service.js.map