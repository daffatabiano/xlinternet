// blog.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { BlogController } from './blog.controller';
import { BlogService }    from './blog.service';
import { PrismaModule }   from '../../config/prisma.module';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({ storage: memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }),
  ],
  controllers: [BlogController],
  providers:   [BlogService],
})
export class BlogModule {}
