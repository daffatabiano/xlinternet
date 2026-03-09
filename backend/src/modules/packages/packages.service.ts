// packages.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackageFilterDto } from './dto/package-filter.dto';
import slugify from 'slugify';

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: PackageFilterDto) {
    const { page = 1, limit = 20, providerId, category, minPrice, maxPrice, minSpeed, maxSpeed, contractMonths, sortBy = 'popular' } = filters;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (providerId)     where.providerId     = providerId;
    if (category)       where.category       = category.toUpperCase();
    if (contractMonths !== undefined) where.contractMonths = contractMonths;
    if (minPrice || maxPrice) where.price    = { ...(minPrice && { gte: minPrice }), ...(maxPrice && { lte: maxPrice }) };
    if (minSpeed || maxSpeed) where.speed    = { ...(minSpeed && { gte: minSpeed }), ...(maxSpeed && { lte: maxSpeed }) };

    const orderBy: any =
      sortBy === 'price'   ? [{ price: 'asc' }] :
      sortBy === 'speed'   ? [{ speed: 'desc' }] :
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
      where:   { isFeatured: true, isActive: true },
      take:    6,
      orderBy: [{ isPopular: 'desc' }, { price: 'asc' }],
      include: { provider: { select: { id: true, name: true, slug: true, logo: true } } },
    });
  }

  async findBySlug(slug: string) {
    const pkg = await this.prisma.package.findUnique({
      where:   { slug },
      include: { provider: true },
    });
    if (!pkg) throw new NotFoundException(`Paket "${slug}" tidak ditemukan`);
    return pkg;
  }

  async findById(id: string) {
    const pkg = await this.prisma.package.findUnique({ where: { id }, include: { provider: true } });
    if (!pkg) throw new NotFoundException('Paket tidak ditemukan');
    return pkg;
  }

  async findByProvider(providerId: string) {
    return this.prisma.package.findMany({
      where:   { providerId, isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  async create(dto: CreatePackageDto) {
    const slug = dto.slug ?? slugify(dto.name, { lower: true, strict: true });
    const existing = await this.prisma.package.findUnique({ where: { slug } });
    if (existing) throw new ConflictException(`Slug "${slug}" sudah digunakan`);

    return this.prisma.package.create({
      data: {
        name:            dto.name,
        slug,
        description:     dto.description,
        speed:           dto.speed,
        price:           dto.price,
        installationFee: dto.installationFee ?? 0,
        contractMonths:  dto.contractMonths  ?? 0,
        quota:           dto.quota           ?? 'unlimited',
        latency:         dto.latency         ?? 20,
        features:        dto.features        ?? [],
        category:        (dto.category?.toUpperCase() ?? 'STANDARD') as any,
        isFeatured:      dto.isFeatured      ?? false,
        isPopular:       dto.isPopular       ?? false,
        isActive:        dto.isActive        ?? true,
        providerId:      dto.providerId,
      },
      include: { provider: { select: { id: true, name: true, slug: true } } },
    });
  }

  async update(id: string, dto: UpdatePackageDto) {
    await this.findById(id);
    const data: any = { ...dto };
    if (dto.category) data.category = dto.category.toUpperCase();
    return this.prisma.package.update({
      where:   { id },
      data,
      include: { provider: { select: { id: true, name: true, slug: true } } },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.package.delete({ where: { id } });
    return { deleted: true };
  }
}
