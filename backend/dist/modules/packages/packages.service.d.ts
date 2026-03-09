import { PrismaService } from '../../config/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackageFilterDto } from './dto/package-filter.dto';
export declare class PackagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(filters: PackageFilterDto): Promise<{
        data: ({
            provider: {
                id: string;
                name: string;
                slug: string;
                logo: string | null;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findFeatured(): Promise<({
        provider: {
            id: string;
            name: string;
            slug: string;
            logo: string | null;
        };
    } & {
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
    })[]>;
    findBySlug(slug: string): Promise<{
        provider: {
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
    } & {
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
    }>;
    findById(id: string): Promise<{
        provider: {
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
    } & {
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
    }>;
    findByProvider(providerId: string): Promise<{
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
    }[]>;
    create(dto: CreatePackageDto): Promise<{
        provider: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
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
    }>;
    update(id: string, dto: UpdatePackageDto): Promise<{
        provider: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
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
    }>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
}
//# sourceMappingURL=packages.service.d.ts.map