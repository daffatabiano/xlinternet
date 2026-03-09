// coverage.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class CoverageService {
  constructor(private readonly prisma: PrismaService) {}

  async check(address: string, city: string, postalCode?: string) {
    const where: any = {
      isAvailable: true,
      OR: [
        { city:       { contains: city, mode: 'insensitive' } },
        { province:   { contains: city, mode: 'insensitive' } },
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
          where:   { isActive: true },
          orderBy: { price: 'asc' },
          take:    3,
        },
      },
    });

    const availableProviders = providers.map((provider) => ({
      provider,
      packages:     provider.packages || [],
      coverageType: 'full' as const,
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
      where:    { isAvailable: true },
      select:   { city: true },
      distinct: ['city'],
      orderBy:  { city: 'asc' },
    });
    return cities.map((c) => c.city);
  }

  async addCoverageArea(providerId: string, areas: { province: string; city: string; district?: string; postalCode?: string }[]) {
    return this.prisma.coverageArea.createMany({
      data: areas.map((a) => ({ ...a, providerId, isAvailable: true })),
      skipDuplicates: true,
    });
  }

  async removeCoverageArea(id: string) {
    return this.prisma.coverageArea.delete({ where: { id } });
  }
}
