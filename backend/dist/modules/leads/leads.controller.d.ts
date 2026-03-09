import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadStatusDto, LeadFilterDto, TrackVisitDto } from './dto/lead.dto';
import { Request } from 'express';
export declare class LeadsController {
    private readonly service;
    constructor(service: LeadsService);
    create(dto: CreateLeadDto, req: Request): Promise<{
        lead: {
            provider: {
                name: string;
            } | null;
            package: {
                name: string;
            } | null;
        } & {
            id: string;
            name: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            city: string;
            providerId: string | null;
            packageId: string | null;
            status: import(".prisma/client").$Enums.LeadStatus;
            address: string | null;
            interest: string;
            source: import(".prisma/client").$Enums.LeadSource;
            message: string | null;
            utmSource: string | null;
            utmMedium: string | null;
            utmCampaign: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            referrer: string | null;
            whatsappSent: boolean;
            notes: string | null;
            assignedTo: string | null;
        };
        whatsappUrl: string;
    }>;
    trackVisit(dto: TrackVisitDto): void;
    findAll(filters: LeadFilterDto): Promise<{
        data: ({
            provider: {
                id: string;
                name: string;
                slug: string;
            } | null;
            package: {
                id: string;
                name: string;
                slug: string;
            } | null;
        } & {
            id: string;
            name: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            city: string;
            providerId: string | null;
            packageId: string | null;
            status: import(".prisma/client").$Enums.LeadStatus;
            address: string | null;
            interest: string;
            source: import(".prisma/client").$Enums.LeadSource;
            message: string | null;
            utmSource: string | null;
            utmMedium: string | null;
            utmCampaign: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            referrer: string | null;
            whatsappSent: boolean;
            notes: string | null;
            assignedTo: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(): Promise<{
        total: number;
        newToday: number;
        contacted: number;
        qualified: number;
        converted: number;
        lost: number;
        conversionRate: number;
        bySource: {
            source: import(".prisma/client").$Enums.LeadSource;
            count: number;
        }[];
        dailyLeads: {
            date: string;
            count: number;
        }[];
    }>;
    findById(id: string): Promise<{
        provider: {
            id: string;
            name: string;
            slug: string;
        } | null;
        package: {
            id: string;
            name: string;
            slug: string;
            price: number;
            speed: number;
        } | null;
    } & {
        id: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        city: string;
        providerId: string | null;
        packageId: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
        address: string | null;
        interest: string;
        source: import(".prisma/client").$Enums.LeadSource;
        message: string | null;
        utmSource: string | null;
        utmMedium: string | null;
        utmCampaign: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        referrer: string | null;
        whatsappSent: boolean;
        notes: string | null;
        assignedTo: string | null;
    }>;
    updateStatus(id: string, dto: UpdateLeadStatusDto): Promise<{
        id: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        city: string;
        providerId: string | null;
        packageId: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
        address: string | null;
        interest: string;
        source: import(".prisma/client").$Enums.LeadSource;
        message: string | null;
        utmSource: string | null;
        utmMedium: string | null;
        utmCampaign: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        referrer: string | null;
        whatsappSent: boolean;
        notes: string | null;
        assignedTo: string | null;
    }>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
}
//# sourceMappingURL=leads.controller.d.ts.map