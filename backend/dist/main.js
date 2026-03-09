"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['log', 'error', 'warn', 'debug'],
    });
    const config = app.get(config_1.ConfigService);
    const port = config.get('PORT') || 3001;
    // ── Security ──────────────────────────────────────────────────────────────
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    // ── CORS ──────────────────────────────────────────────────────────────────
    app.enableCors({
        origin: config.get('FRONTEND_URL') || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    // ── Global prefix ─────────────────────────────────────────────────────────
    app.setGlobalPrefix('api');
    // ── Global pipes ──────────────────────────────────────────────────────────
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    // ── Global filters & interceptors ─────────────────────────────────────────
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    // ── Swagger docs ──────────────────────────────────────────────────────────
    if (config.get('NODE_ENV') !== 'production') {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('XL Net API')
            .setDescription('API Platform Provider Internet XL')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('auth', 'Autentikasi Admin')
            .addTag('providers', 'Manajemen Provider')
            .addTag('packages', 'Manajemen Paket')
            .addTag('blog', 'Manajemen Blog')
            .addTag('reviews', 'Manajemen Ulasan')
            .addTag('coverage', 'Cek Coverage Area')
            .addTag('dashboard', 'Dashboard Statistik')
            .build();
        const doc = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('api/docs', app, doc, {
            swaggerOptions: { persistAuthorization: true },
        });
    }
    await app.listen(port);
    logger.log(`🚀 XL Net API running on: http://localhost:${port}/api`);
    logger.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map