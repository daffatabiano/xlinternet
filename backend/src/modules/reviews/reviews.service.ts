import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService }    from '../../config/prisma.service';
import { ProvidersService } from '../providers/providers.service';

export class CreateReviewDto {
  userName:      string;
  userEmail?:    string;
  userCity:      string;
  rating:        number;
  speedRating?:  number;
  priceRating?:  number;
  supportRating?: number;
  comment:       string;
  providerId:    string;
  packageId?:    string;
}

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma:     PrismaService,
    private readonly providers:  ProvidersService,
  ) {}

  async findAll(params: { page?: number; limit?: number; providerId?: string; approved?: boolean }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;
    const where: any = {};
    if (params.providerId !== undefined) where.providerId = params.providerId;
    if (params.approved !== undefined) where.isApproved = params.approved;

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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException('Error fetching reviews: ' + message);
    }
  }

  async findApproved(params: { page?: number; limit?: number; providerId?: string }) {
    return this.findAll({ ...params, approved: true });
  }

  async findByProvider(providerId: string, params: { page?: number; limit?: number }) {
    return this.findAll({ ...params, providerId, approved: true });
  }

  async create(dto: CreateReviewDto) {
    if (dto.rating < 1 || dto.rating > 5) throw new BadRequestException('Rating harus antara 1 dan 5');
    await this.providers.findById(dto.providerId);
    const review = await this.prisma.review.create({
      data: {
        userName:     dto.userName,
        userEmail:    dto.userEmail,
        userCity:     dto.userCity,
        rating:       dto.rating,
        speedRating:  dto.speedRating  ?? dto.rating,
        priceRating:  dto.priceRating  ?? dto.rating,
        supportRating: dto.supportRating ?? dto.rating,
        comment:      dto.comment,
        providerId:   dto.providerId,
        packageId:    dto.packageId,
        isApproved:   false,
      },
      include: { provider: { select: { id: true, name: true } } },
    });
    return review;
  }

  async approve(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review tidak ditemukan');
    const updated = await this.prisma.review.update({ where: { id }, data: { isApproved: true } });
    await this.providers.updateRating(review.providerId);
    return updated;
  }

  async reject(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review tidak ditemukan');
    return this.prisma.review.update({ where: { id }, data: { isApproved: false } });
  }

  async delete(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review tidak ditemukan');
    await this.prisma.review.delete({ where: { id } });
    await this.providers.updateRating(review.providerId);
    return { deleted: true };
  }

  async markHelpful(id: string) {
    return this.prisma.review.update({
      where: { id },
      data:  { helpfulCount: { increment: 1 } },
    });
  }
}
