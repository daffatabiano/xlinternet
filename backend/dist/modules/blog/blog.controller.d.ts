import { BlogService, CreateBlogDto, UpdateBlogDto, BlogFilterDto } from './blog.service';
export declare class BlogController {
    private readonly service;
    constructor(service: BlogService);
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
    getCategories(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string;
    }[]>;
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
    create(dto: CreateBlogDto, file?: Express.Multer.File): Promise<{
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
    update(id: string, dto: UpdateBlogDto, file?: Express.Multer.File): Promise<{
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
    createCategory(body: {
        name: string;
        description?: string;
        color?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string;
    }>;
}
//# sourceMappingURL=blog.controller.d.ts.map