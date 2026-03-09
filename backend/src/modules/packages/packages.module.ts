// packages.module.ts
import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackagesService }    from './packages.service';
import { PrismaModule }       from '../../config/prisma.module';

@Module({
  imports:     [PrismaModule],
  controllers: [PackagesController],
  providers:   [PackagesService],
  exports:     [PackagesService],
})
export class PackagesModule {}
