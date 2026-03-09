"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./config/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const providers_module_1 = require("./modules/providers/providers.module");
const packages_module_1 = require("./modules/packages/packages.module");
const blog_module_1 = require("./modules/blog/blog.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const coverage_module_1 = require("./modules/coverage/coverage.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const leads_module_1 = require("./modules/leads/leads.module");
const app_config_1 = __importDefault(require("./config/app.config"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // ── Config ──────────────────────────────────────────────────────────────
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default],
                envFilePath: '.env',
            }),
            // ── Rate limiting (100 req/15min per IP) ────────────────────────────────
            throttler_1.ThrottlerModule.forRoot([{ ttl: 900_000, limit: 100 }]),
            // ── Core ────────────────────────────────────────────────────────────────
            prisma_module_1.PrismaModule,
            // ── Feature modules ─────────────────────────────────────────────────────
            auth_module_1.AuthModule,
            providers_module_1.ProvidersModule,
            packages_module_1.PackagesModule,
            blog_module_1.BlogModule,
            reviews_module_1.ReviewsModule,
            coverage_module_1.CoverageModule,
            dashboard_module_1.DashboardModule,
            leads_module_1.LeadsModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map