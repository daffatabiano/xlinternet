// ─── providers.module.ts ─────────────────────────────────────────────────────
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProvidersController } from './providers.controller';
import { ProvidersService }    from './providers.service';
import { PrismaModule }        from '../../config/prisma.module';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({ storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }),
  ],
  controllers: [ProvidersController],
  providers:   [ProvidersService],
  exports:     [ProvidersService],
})
export class ProvidersModule {}
