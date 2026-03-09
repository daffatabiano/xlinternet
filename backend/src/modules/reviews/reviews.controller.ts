import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, UseGuards, HttpCode, HttpStatus, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewsService, CreateReviewDto } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  // Public
  @Get()
  @ApiOperation({ summary: 'Get reviews (admin: all, public: approved)' })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('providerId') providerId?: string,
    @Query('approved') approved?: string,
  ) {
    const approvedBool = approved !== undefined ? approved === 'true' : undefined;
    return this.service.findAll({ page, limit, providerId, approved: approvedBool });
  }

  @Get('approved')
  @ApiOperation({ summary: 'Get approved reviews' })
  findApproved(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('providerId') providerId?: string,
  ) {
    return this.service.findApproved({ page, limit, providerId });
  }

  @Get('provider/:providerId')
  @ApiOperation({ summary: 'Get reviews by provider' })
  findByProvider(
    @Param('providerId') providerId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.service.findByProvider(providerId, { page, limit });
  }

  @Post()
  @ApiOperation({ summary: 'Submit new review (public)' })
  create(@Body() dto: CreateReviewDto) {
    return this.service.create(dto);
  }

  @Patch(':id/helpful')
  @ApiOperation({ summary: 'Mark review as helpful' })
  markHelpful(@Param('id') id: string) {
    return this.service.markHelpful(id);
  }

  // Admin only
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve review (admin)' })
  approve(@Param('id') id: string) {
    return this.service.approve(id);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject review (admin)' })
  reject(@Param('id') id: string) {
    return this.service.reject(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete review (admin)' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
