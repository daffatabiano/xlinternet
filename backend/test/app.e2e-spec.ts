import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/config/prisma.service';

// Mock PrismaService to avoid actual DB connections
const mockPrismaService = {
  provider: {
    findMany: jest.fn().mockResolvedValue([]),
    findFirst: jest.fn().mockResolvedValue(null),
    count: jest.fn().mockResolvedValue(0),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  package: {
    findMany: jest.fn().mockResolvedValue([]),
    findFirst: jest.fn().mockResolvedValue(null),
    count: jest.fn().mockResolvedValue(0),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  blogPost: {
    findMany: jest.fn().mockResolvedValue([]),
    findFirst: jest.fn().mockResolvedValue(null),
    count: jest.fn().mockResolvedValue(0),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  blogCategory: {
    findMany: jest.fn().mockResolvedValue([]),
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn(),
  },
  review: {
    findMany: jest.fn().mockResolvedValue([]),
    findFirst: jest.fn().mockResolvedValue(null),
    count: jest.fn().mockResolvedValue(0),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  coverageArea: {
    findMany: jest.fn().mockResolvedValue([]),
    findFirst: jest.fn().mockResolvedValue(null),
    groupBy: jest.fn().mockResolvedValue([]),
  },
  lead: {
    findMany: jest.fn().mockResolvedValue([]),
    findFirst: jest.fn().mockResolvedValue(null),
    count: jest.fn().mockResolvedValue(0),
    create: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Test',
      phone: '6281234567890',
      whatsappUrl: 'https://wa.me/6281709998817',
    }),
    update: jest.fn(),
    delete: jest.fn(),
  },
  adminUser: {
    findUnique: jest.fn().mockResolvedValue(null),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  onModuleInit: jest.fn(),
  onModuleDestroy: jest.fn(),
};

describe('XL Net API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Auth
  describe('/auth', () => {
    it('POST /auth/login — should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'wrong' })
        .expect(401);
    });

    it('POST /auth/login — should reject missing body', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });
  });

  // Providers
  describe('/providers', () => {
    it('GET /providers — should return list', () => {
      return request(app.getHttpServer()).get('/providers').expect(200);
    });

    it('GET /providers/featured — should return featured', () => {
      return request(app.getHttpServer())
        .get('/providers/featured')
        .expect(200);
    });

    it('GET /providers/:slug — should return 404 for non-existent', () => {
      return request(app.getHttpServer())
        .get('/providers/non-existent-slug')
        .expect(404);
    });
  });

  // Packages
  describe('/packages', () => {
    it('GET /packages — should return list', () => {
      return request(app.getHttpServer()).get('/packages').expect(200);
    });

    it('GET /packages/featured — should return featured', () => {
      return request(app.getHttpServer())
        .get('/packages/featured')
        .expect(200);
    });
  });

  // Blog
  describe('/blog', () => {
    it('GET /blog — should return list', () => {
      return request(app.getHttpServer()).get('/blog').expect(200);
    });

    it('GET /blog/published — should return published posts', () => {
      return request(app.getHttpServer()).get('/blog/published').expect(200);
    });

    it('GET /blog/categories — should return categories', () => {
      return request(app.getHttpServer()).get('/blog/categories').expect(200);
    });
  });

  // Reviews
  describe('/reviews', () => {
    it('GET /reviews — should return list', () => {
      return request(app.getHttpServer()).get('/reviews').expect(200);
    });

    it('GET /reviews/approved — should return approved', () => {
      return request(app.getHttpServer()).get('/reviews/approved').expect(200);
    });
  });

  // Coverage
  describe('/coverage', () => {
    it('POST /coverage/check — should validate body', () => {
      return request(app.getHttpServer())
        .post('/coverage/check')
        .send({})
        .expect(400);
    });

    it('GET /coverage/cities — should return cities', () => {
      return request(app.getHttpServer()).get('/coverage/cities').expect(200);
    });
  });

  // Leads
  describe('/leads', () => {
    it('POST /leads — should create lead with valid data', () => {
      return request(app.getHttpServer())
        .post('/leads')
        .send({
          name: 'Test User',
          phone: '6281234567890',
          city: 'Jakarta',
          interest: 'XL Home 100Mbps',
          source: 'WEBSITE',
        })
        .expect(201);
    });

    it('POST /leads — should reject missing required fields', () => {
      return request(app.getHttpServer())
        .post('/leads')
        .send({ name: 'Test' })
        .expect(400);
    });

    it('GET /leads — should require auth', () => {
      return request(app.getHttpServer()).get('/leads').expect(401);
    });

    it('GET /leads/stats — should require auth', () => {
      return request(app.getHttpServer()).get('/leads/stats').expect(401);
    });
  });

  // Dashboard
  describe('/dashboard', () => {
    it('GET /dashboard/stats — should require auth', () => {
      return request(app.getHttpServer())
        .get('/dashboard/stats')
        .expect(401);
    });
  });
});
