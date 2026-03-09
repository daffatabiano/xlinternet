import { PrismaService } from '../../config/prisma.service';
export declare class CoverageService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    check(address: string, city: string, postalCode?: string): Promise<{
        address: string;
        city: string;
        postalCode: string | undefined;
        availableProviders: {
            provider: {
                packages: {
                    id: string;
                    name: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    slug: string;
                    isFeatured: boolean;
                    features: string[];
                    providerId: string;
                    price: number;
                    speed: number;
                    installationFee: number;
                    contractMonths: number;
                    quota: string;
                    latency: number;
                    category: import(".prisma/client").$Enums.PackageCategory;
                    isPopular: boolean;
                }[];
            } & {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                slug: string;
                tagline: string;
                type: import(".prisma/client").$Enums.ProviderType;
                minPrice: number;
                maxSpeed: number;
                website: string | null;
                phone: string | null;
                isFeatured: boolean;
                logo: string | null;
                features: string[];
                pros: string[];
                cons: string[];
                rating: number;
                reviewCount: number;
            };
            packages: {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                slug: string;
                isFeatured: boolean;
                features: string[];
                providerId: string;
                price: number;
                speed: number;
                installationFee: number;
                contractMonths: number;
                quota: string;
                latency: number;
                category: import(".prisma/client").$Enums.PackageCategory;
                isPopular: boolean;
            }[];
            coverageType: "full";
        }[];
    }>;
    getCities(): Promise<string[]>;
    addCoverageArea(providerId: string, areas: {
        province: string;
        city: string;
        district?: string;
        postalCode?: string;
    }[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    removeCoverageArea(id: string): Promise<{
        id: string;
        createdAt: Date;
        city: string;
        province: string;
        district: string | null;
        postalCode: string | null;
        isAvailable: boolean;
        providerId: string;
    }>;
}
//# sourceMappingURL=coverage.service.d.ts.map