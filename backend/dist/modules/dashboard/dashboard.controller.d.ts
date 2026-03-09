import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly service;
    constructor(service: DashboardService);
    getStats(): Promise<{
        totalProviders: number;
        totalPackages: number;
        totalBlogPosts: number;
        totalReviews: number;
        pendingReviews: number;
        newReviewsThisMonth: number;
        totalPageViews: number;
        topProviders: {
            provider: {
                id: string;
                name: string;
                slug: string;
                rating: number;
                reviewCount: number;
            };
            score: number;
        }[];
        totalLeads: number;
        newLeadsToday: number;
        convertedLeads: number;
        conversionRate: number;
    }>;
    getActivity(): Promise<{
        recentReviews: ({
            provider: {
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
        })[];
        recentPosts: {
            id: string;
            createdAt: Date;
            title: string;
            isPublished: boolean;
        }[];
    }>;
    getAnalytics(period?: string): Promise<{
        stats: {
            totalVisitors: number;
            totalPageviews: number;
            avgSessionDuration: string;
            bounceRate: number;
        };
        chartData: {
            visitors: number;
            pageviews: number;
            leads: number;
            date: string;
        }[];
        trafficSources: {
            name: string;
            value: number;
        }[];
        topPages: {
            page: string;
            title: string;
            views: number;
            bounce: number;
        }[];
        devices: {
            name: string;
            value: number;
        }[];
        topCities: {
            city: string;
            pct: number;
        }[];
    }>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map