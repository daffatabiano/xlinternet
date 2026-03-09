// coverage.module.ts
import { Module } from '@nestjs/common';
import { CoverageController } from './coverage.controller';
import { CoverageService }    from './coverage.service';
import { PrismaModule }       from '../../config/prisma.module';

@Module({
  imports:     [PrismaModule],
  controllers: [CoverageController],
  providers:   [CoverageService],
})
export class CoverageModule {}
