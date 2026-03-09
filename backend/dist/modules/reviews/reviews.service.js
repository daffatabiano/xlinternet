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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = exports.CreateReviewDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const providers_service_1 = require("../providers/providers.service");
class CreateReviewDto {
}
exports.CreateReviewDto = CreateReviewDto;
let ReviewsService = class ReviewsService {
    constructor(prisma, providers) {
        this.prisma = prisma;
        this.providers = providers;
    }
    async findAll(params) {
        const page = Math.max(1, params.page || 1);
        const limit = Math.min(100, Math.max(1, params.limit || 20));
        const skip = (page - 1) * limit;
        const where = {};
        if (params.providerId !== undefined)
            where.providerId = params.providerId;
        if (params.approved !== undefined)
            where.isApproved = params.approved;
        try {
            const [data, total] = await Promise.all([
                this.prisma.review.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                    include: { provider: true, package: true },
                }),
                this.prisma.review.count({ where }),
            ]);
            return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new common_1.BadRequestException('Error fetching reviews: ' + message);
        }
    }
    async findApproved(params) {
        return this.findAll({ ...params, approved: true });
    }
    async findByProvider(providerId, params) {
        return this.findAll({ ...params, providerId, approved: true });
    }
    async create(dto) {
        if (dto.rating < 1 || dto.rating > 5)
            throw new common_1.BadRequestException('Rating harus antara 1 dan 5');
        await this.providers.findById(dto.providerId);
        const review = await this.prisma.review.create({
            data: {
                userName: dto.userName,
                userEmail: dto.userEmail,
                userCity: dto.userCity,
                rating: dto.rating,
                speedRating: dto.speedRating ?? dto.rating,
                priceRating: dto.priceRating ?? dto.rating,
                supportRating: dto.supportRating ?? dto.rating,
                comment: dto.comment,
                providerId: dto.providerId,
                packageId: dto.packageId,
                isApproved: false,
            },
            include: { provider: { select: { id: true, name: true } } },
        });
        return review;
    }
    async approve(id) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review tidak ditemukan');
        const updated = await this.prisma.review.update({ where: { id }, data: { isApproved: true } });
        await this.providers.updateRating(review.providerId);
        return updated;
    }
    async reject(id) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review tidak ditemukan');
        return this.prisma.review.update({ where: { id }, data: { isApproved: false } });
    }
    async delete(id) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review tidak ditemukan');
        await this.prisma.review.delete({ where: { id } });
        await this.providers.updateRating(review.providerId);
        return { deleted: true };
    }
    async markHelpful(id) {
        return this.prisma.review.update({
            where: { id },
            data: { helpfulCount: { increment: 1 } },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        providers_service_1.ProvidersService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map