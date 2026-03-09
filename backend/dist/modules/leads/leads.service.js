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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
let LeadsService = class LeadsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get salesNumber() {
        return process.env.WHATSAPP_SALES_NUMBER || '6281709998817';
    }
    generateWhatsAppUrl(name, city, packageName) {
        const msg = `Halo, saya ${name} dari ${city}.${packageName ? ` Saya tertarik dengan paket ${packageName}.` : ''} Boleh saya mendapatkan informasi lebih lanjut?`;
        return `https://wa.me/${this.salesNumber}?text=${encodeURIComponent(msg)}`;
    }
    async create(dto, metadata) {
        // Normalize phone
        let phone = dto.phone.replace(/\s+/g, '');
        if (phone.startsWith('0'))
            phone = '62' + phone.slice(1);
        if (phone.startsWith('+'))
            phone = phone.slice(1);
        const lead = await this.prisma.lead.create({
            data: {
                name: dto.name,
                phone,
                email: dto.email,
                city: dto.city,
                address: dto.address,
                interest: dto.interest,
                packageId: dto.packageId || null,
                providerId: dto.providerId || null,
                source: dto.source?.toUpperCase() || 'WEBSITE',
                message: dto.message,
                utmSource: dto.utmSource,
                utmMedium: dto.utmMedium,
                utmCampaign: dto.utmCampaign,
                ipAddress: metadata?.ipAddress,
                userAgent: metadata?.userAgent,
                referrer: metadata?.referrer,
            },
            include: { package: { select: { name: true } }, provider: { select: { name: true } } },
        });
        const packageName = lead.package?.name || dto.interest;
        const whatsappUrl = this.generateWhatsAppUrl(dto.name, dto.city, packageName);
        return { lead, whatsappUrl };
    }
    async findAll(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.status)
            where.status = filters.status.toUpperCase();
        if (filters.source)
            where.source = filters.source.toUpperCase();
        if (filters.dateFrom || filters.dateTo) {
            where.createdAt = {};
            if (filters.dateFrom)
                where.createdAt.gte = new Date(filters.dateFrom);
            if (filters.dateTo)
                where.createdAt.lte = new Date(filters.dateTo);
        }
        const [data, total] = await Promise.all([
            this.prisma.lead.findMany({
                where, skip, take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    package: { select: { id: true, name: true, slug: true } },
                    provider: { select: { id: true, name: true, slug: true } },
                },
            }),
            this.prisma.lead.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findById(id) {
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                package: { select: { id: true, name: true, slug: true, speed: true, price: true } },
                provider: { select: { id: true, name: true, slug: true } },
            },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead tidak ditemukan');
        return lead;
    }
    async updateStatus(id, dto) {
        await this.findById(id);
        return this.prisma.lead.update({
            where: { id },
            data: {
                status: dto.status,
                notes: dto.notes,
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.lead.delete({ where: { id } });
        return { deleted: true };
    }
    async getStats() {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const [total, newToday, contacted, qualified, converted, lost, bySource, dailyLeads] = await Promise.all([
            this.prisma.lead.count(),
            this.prisma.lead.count({ where: { createdAt: { gte: todayStart } } }),
            this.prisma.lead.count({ where: { status: 'CONTACTED' } }),
            this.prisma.lead.count({ where: { status: 'QUALIFIED' } }),
            this.prisma.lead.count({ where: { status: 'CONVERTED' } }),
            this.prisma.lead.count({ where: { status: 'LOST' } }),
            this.prisma.lead.groupBy({ by: ['source'], _count: { id: true } }),
            this.prisma.lead.groupBy({
                by: ['createdAt'],
                where: { createdAt: { gte: weekAgo } },
                _count: { id: true },
                orderBy: { createdAt: 'asc' },
            }),
        ]);
        const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
        return {
            total, newToday, contacted, qualified, converted, lost,
            conversionRate,
            bySource: bySource.map((s) => ({ source: s.source, count: s._count.id })),
            dailyLeads: dailyLeads.map((d) => ({
                date: d.createdAt.toISOString().split('T')[0],
                count: d._count.id,
            })),
        };
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map