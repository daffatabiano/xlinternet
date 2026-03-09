import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderFilterDto } from './dto/provider-filter.dto';
import slugify from 'slugify';

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: ProviderFilterDto) {
    const { page = 1, limit = 20, type, city, minRating } = filters;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (type) where.type = type.toUpperCase();
    if (minRating) where.rating = { gte: minRating };
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
      where:   { isFeatured: true, isActive: true },
      orderBy: { rating: 'desc' },
      take:    6,
      include: { coverageAreas: { take: 3 } },
    });
  }

  async findBySlug(slug: string) {
    const provider = await this.prisma.provider.findUnique({
      where:   { slug },
      include: {
        coverageAreas: true,
        packages:      { where: { isActive: true }, orderBy: { price: 'asc' } },
        reviews:       { where: { isApproved: true }, orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!provider) throw new NotFoundException(`Provider "${slug}" tidak ditemukan`);
    return provider;
  }

  async findById(id: string) {
    const provider = await this.prisma.provider.findUnique({
      where:   { id },
      include: { coverageAreas: true },
    });
    if (!provider) throw new NotFoundException(`Provider tidak ditemukan`);
    return provider;
  }

  async create(dto: CreateProviderDto, logoPath?: string) {
    const slug = dto.slug ?? slugify(dto.name, { lower: true, strict: true });

    const existing = await this.prisma.provider.findUnique({ where: { slug } });
    if (existing) throw new ConflictException(`Slug "${slug}" sudah digunakan`);

    return this.prisma.provider.create({
      data: {
        ...dto,
        slug,
        logo: logoPath,
        type: (dto.type?.toUpperCase() as any) ?? 'FIBER',
      },
    });
  }

  async update(id: string, dto: UpdateProviderDto, logoPath?: string) {
    await this.findById(id);
    const data: any = { ...dto };
    if (logoPath) data.logo = logoPath;
    if (dto.type) data.type = dto.type.toUpperCase();

    return this.prisma.provider.update({ where: { id }, data });
  }

  async toggleActive(id: string) {
    const provider = await this.findById(id);
    return this.prisma.provider.update({
      where: { id },
      data:  { isActive: !provider.isActive },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.provider.delete({ where: { id } });
  }

  async updateRating(providerId: string) {
    const agg = await this.prisma.review.aggregate({
      where:  { providerId, isApproved: true },
      _avg:   { rating: true },
      _count: { rating: true },
    });
    await this.prisma.provider.update({
      where: { id: providerId },
      data:  {
        rating:      Math.round((agg._avg.rating ?? 0) * 10) / 10,
        reviewCount: agg._count.rating,
      },
    });
  }
}
