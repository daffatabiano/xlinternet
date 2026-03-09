export declare class CreateLeadDto {
    name: string;
    phone: string;
    email?: string;
    city: string;
    address?: string;
    interest: string;
    packageId?: string;
    providerId?: string;
    source?: string;
    message?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
}
export declare class UpdateLeadStatusDto {
    status: string;
    notes?: string;
}
export declare class LeadFilterDto {
    status?: string;
    source?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}
export declare class TrackVisitDto {
    page: string;
    referrer?: string;
    userAgent?: string;
}
//# sourceMappingURL=lead.dto.d.ts.map