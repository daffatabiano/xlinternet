import { PrismaService } from '../../config/prisma.service';
import { ProvidersService } from '../providers/providers.service';
export declare class CreateReviewDto {
    userName: string;
    userEmail?: string;
    userCity: string;
    rating: number;
    speedRating?: number;
    priceRating?: number;
    supportRating?: number;
    comment: string;
    providerId: string;
    packageId?: string;
}
export declare class ReviewsService {
    private readonly prisma;
    private readonly providers;
    constructor(prisma: PrismaService, providers: ProvidersService);
    findAll(params: {
        page?: number;
        limit?: number;
        providerId?: string;
        approved?: boolean;
    }): Promise<{
        data: ({
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
            package: {
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            providerId: string;
            isApproved: boolean;
            speedRating: number;
            priceRating: number;
            supportRating: number;
            helpfulCount: number;
            userName: string;
            userEmail: string | null;
            userAvatar: string | null;
            userCity: string;
            comment: string;
            isVerified: boolean;
            packageId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findApproved(params: {
        page?: number;
        limit?: number;
        providerId?: string;
    }): Promise<{
        data: ({
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
            package: {
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            providerId: string;
            isApproved: boolean;
            speedRating: number;
            priceRating: number;
            supportRating: number;
            helpfulCount: number;
            userName: string;
            userEmail: string | null;
            userAvatar: string | null;
            userCity: string;
            comment: string;
            isVerified: boolean;
            packageId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByProvider(providerId: string, params: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
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
            package: {
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            providerId: string;
            isApproved: boolean;
            speedRating: number;
            priceRating: number;
            supportRating: number;
            helpfulCount: number;
            userName: string;
            userEmail: string | null;
            userAvatar: string | null;
            userCity: string;
            comment: string;
            isVerified: boolean;
            packageId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(dto: CreateReviewDto): Promise<{
        provider: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        providerId: string;
        isApproved: boolean;
        speedRating: number;
        priceRating: number;
        supportRating: number;
        helpfulCount: number;
        userName: string;
        userEmail: string | null;
        userAvatar: string | null;
        userCity: string;
        comment: string;
        isVerified: boolean;
        packageId: string | null;
    }>;
    approve(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        providerId: string;
        isApproved: boolean;
        speedRating: number;
        priceRating: number;
        supportRating: number;
        helpfulCount: number;
        userName: string;
        userEmail: string | null;
        userAvatar: string | null;
        userCity: string;
        comment: string;
        isVerified: boolean;
        packageId: string | null;
    }>;
    reject(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        providerId: string;
        isApproved: boolean;
        speedRating: number;
        priceRating: number;
        supportRating: number;
        helpfulCount: number;
        userName: string;
        userEmail: string | null;
        userAvatar: string | null;
        userCity: string;
        comment: string;
        isVerified: boolean;
        packageId: string | null;
    }>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
    markHelpful(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        providerId: string;
        isApproved: boolean;
        speedRating: number;
        priceRating: number;
        supportRating: number;
        helpfulCount: number;
        userName: string;
        userEmail: string | null;
        userAvatar: string | null;
        userCity: string;
        comment: string;
        isVerified: boolean;
        packageId: string | null;
    }>;
}
//# sourceMappingURL=reviews.service.d.ts.map