import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../../config/prisma.service';

const mockPrisma = {
  lead: {
    create: jest.fn(),
    findMany: jest.fn().mockResolvedValue([]),
    findFirst: jest.fn(),
    count: jest.fn().mockResolvedValue(0),
    update: jest.fn(),
    delete: jest.fn(),
    groupBy: jest.fn().mockResolvedValue([]),
  },
  $queryRaw: jest.fn().mockResolvedValue([]),
};

describe('LeadsService', () => {
  let service: LeadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<LeadsService>(LeadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateWhatsAppUrl', () => {
    it('should generate correct WhatsApp URL', () => {
      const url = service.generateWhatsAppUrl('6281234567890', 'Halo');
      expect(url).toContain('wa.me/6281709998817');
      expect(url).toContain('Halo');
    });
  });

  describe('create', () => {
    it('should create a lead and return whatsapp URL', async () => {
      mockPrisma.lead.create.mockResolvedValueOnce({
        id: '1',
        name: 'Test',
        phone: '6281234567890',
        city: 'Jakarta',
        interest: 'XL Home',
        source: 'WEBSITE',
        status: 'NEW',
      });

      const result = await service.create({
        name: 'Test',
        phone: '6281234567890',
        city: 'Jakarta',
        interest: 'XL Home',
        source: 'WEBSITE',
      });

      expect(result).toHaveProperty('lead');
      expect(result).toHaveProperty('whatsappUrl');
      expect(mockPrisma.lead.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const result = await service.findAll({});
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
    });
  });
});
