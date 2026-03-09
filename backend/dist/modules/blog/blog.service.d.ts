import { PrismaService } from '../../config/prisma.service';
export declare class CreateBlogDto {
    title: string;
    slug?: string;
    excerpt: string;
    content: string;
    categoryId: string;
    authorId: string;
    tags?: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    isPublished?: boolean;
}
declare const UpdateBlogDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBlogDto>>;
export declare class UpdateBlogDto extends UpdateBlogDto_base {
}
export declare class BlogFilterDto {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
}
export declare class BlogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private estimateReadTime;
    findAll(filters: BlogFilterDto): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                description: string | null;
                slug: string;
                color: string;
            };
            author: {
                id: string;
                name: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string[];
            slug: string;
            title: string;
            excerpt: string;
            content: string;
            categoryId: string;
            authorId: string;
            seoTitle: string | null;
            seoDescription: string | null;
            seoKeywords: string[];
            isPublished: boolean;
            featuredImage: string | null;
            readTime: number;
            viewCount: number;
            publishedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findPublished(filters: BlogFilterDto): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                description: string | null;
                slug: string;
                color: string;
            };
            author: {
                id: string;
                name: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string[];
            slug: string;
            title: string;
            excerpt: string;
            content: string;
            categoryId: string;
            authorId: string;
            seoTitle: string | null;
            seoDescription: string | null;
            seoKeywords: string[];
            isPublished: boolean;
            featuredImage: string | null;
            readTime: number;
            viewCount: number;
            publishedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            slug: string;
            color: string;
        };
        author: {
            id: string;
            name: string;
            email: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        categoryId: string;
        authorId: string;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        isPublished: boolean;
        featuredImage: string | null;
        readTime: number;
        viewCount: number;
        publishedAt: Date | null;
    }>;
    findById(id: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            slug: string;
            color: string;
        };
        author: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        categoryId: string;
        authorId: string;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        isPublished: boolean;
        featuredImage: string | null;
        readTime: number;
        viewCount: number;
        publishedAt: Date | null;
    }>;
    getRelated(id: string): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            slug: string;
            color: string;
        };
        author: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        categoryId: string;
        authorId: string;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        isPublished: boolean;
        featuredImage: string | null;
        readTime: number;
        viewCount: number;
        publishedAt: Date | null;
    })[]>;
    create(dto: CreateBlogDto, imagePath?: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            slug: string;
            color: string;
        };
        author: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        categoryId: string;
        authorId: string;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        isPublished: boolean;
        featuredImage: string | null;
        readTime: number;
        viewCount: number;
        publishedAt: Date | null;
    }>;
    update(id: string, dto: Partial<CreateBlogDto>, imagePath?: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            slug: string;
            color: string;
        };
        author: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        categoryId: string;
        authorId: string;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        isPublished: boolean;
        featuredImage: string | null;
        readTime: number;
        viewCount: number;
        publishedAt: Date | null;
    }>;
    publish(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        categoryId: string;
        authorId: string;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        isPublished: boolean;
        featuredImage: string | null;
        readTime: number;
        viewCount: number;
        publishedAt: Date | null;
    }>;
    unpublish(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        categoryId: string;
        authorId: string;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        isPublished: boolean;
        featuredImage: string | null;
        readTime: number;
        viewCount: number;
        publishedAt: Date | null;
    }>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
    getCategories(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string;
    }[]>;
    createCategory(name: string, description?: string, color?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string;
    }>;
}
export {};
//# sourceMappingURL=blog.service.d.ts.map