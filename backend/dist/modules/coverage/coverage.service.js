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
exports.CoverageService = void 0;
// coverage.service.ts
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
let CoverageService = class CoverageService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async check(address, city, postalCode) {
        const where = {
            isAvailable: true,
            OR: [
                { city: { contains: city, mode: 'insensitive' } },
                { province: { contains: city, mode: 'insensitive' } },
            ],
        };
        if (postalCode) {
            where.OR.push({ postalCode: { contains: postalCode } });
        }
        // Step 1: Get distinct provider IDs that cover the area
        const coverageAreas = await this.prisma.coverageArea.findMany({
            where,
            select: { providerId: true },
            distinct: ['providerId'],
        });
        const providerIds = coverageAreas.map((ca) => ca.providerId);
        if (providerIds.length === 0) {
            return { address, city, postalCode, availableProviders: [] };
        }
        // Step 2: Fetch providers with packages
        const providers = await this.prisma.provider.findMany({
            where: { id: { in: providerIds }, isActive: true },
            include: {
                packages: {
                    where: { isActive: true },
                    orderBy: { price: 'asc' },
                    take: 3,
                },
            },
        });
        const availableProviders = providers.map((provider) => ({
            provider,
            packages: provider.packages || [],
            coverageType: 'full',
        }));
        return {
            address,
            city,
            postalCode,
            availableProviders,
        };
    }
    async getCities() {
        const cities = await this.prisma.coverageArea.findMany({
            where: { isAvailable: true },
            select: { city: true },
            distinct: ['city'],
            orderBy: { city: 'asc' },
        });
        return cities.map((c) => c.city);
    }
    async addCoverageArea(providerId, areas) {
        return this.prisma.coverageArea.createMany({
            data: areas.map((a) => ({ ...a, providerId, isAvailable: true })),
            skipDuplicates: true,
        });
    }
    async removeCoverageArea(id) {
        return this.prisma.coverageArea.delete({ where: { id } });
    }
};
exports.CoverageService = CoverageService;
exports.CoverageService = CoverageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoverageService);
//# sourceMappingURL=coverage.service.js.map