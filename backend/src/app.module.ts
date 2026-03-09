import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule }    from './config/prisma.module';
import { AuthModule }      from './modules/auth/auth.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { PackagesModule }  from './modules/packages/packages.module';
import { BlogModule }      from './modules/blog/blog.module';
import { ReviewsModule }   from './modules/reviews/reviews.module';
import { CoverageModule }  from './modules/coverage/coverage.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LeadsModule }     from './modules/leads/leads.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    // ── Config ──────────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load:     [appConfig],
      envFilePath: '.env',
    }),

    // ── Rate limiting (100 req/15min per IP) ────────────────────────────────
    ThrottlerModule.forRoot([{ ttl: 900_000, limit: 100 }]),

    // ── Core ────────────────────────────────────────────────────────────────
    PrismaModule,

    // ── Feature modules ─────────────────────────────────────────────────────
    AuthModule,
    ProvidersModule,
    PackagesModule,
    BlogModule,
    ReviewsModule,
    CoverageModule,
    DashboardModule,
    LeadsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
