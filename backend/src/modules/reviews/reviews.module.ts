// ─── reviews.module.ts ───────────────────────────────────────────────────────
import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService }    from './reviews.service';
import { PrismaModule }      from '../../config/prisma.module';
import { ProvidersModule }   from '../providers/providers.module';

@Module({
  imports: [PrismaModule, ProvidersModule],
  controllers: [ReviewsController],
  providers:   [ReviewsService],
})
export class ReviewsModule {}
