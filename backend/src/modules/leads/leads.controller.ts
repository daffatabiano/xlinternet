import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, UseGuards, Req, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadStatusDto, LeadFilterDto, TrackVisitDto } from './dto/lead.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  // ── Public ─────────────────────────────────────────────────────────────────
  @Post()
  @ApiOperation({ summary: 'Submit new lead (public)' })
  create(@Body() dto: CreateLeadDto, @Req() req: Request) {
    const metadata = {
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.ip,
      userAgent: req.headers['user-agent'],
      referrer:  req.headers['referer'],
    };
    return this.service.create(dto, metadata);
  }

  @Post('track-visit')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Track page visit (anonymous)' })
  trackVisit(@Body() dto: TrackVisitDto) {
    // Basic visitor tracking — could write to analytics DB
    // For now, just acknowledge the request
    return;
  }

  // ── Admin (protected) ──────────────────────────────────────────────────────
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all leads (admin)' })
  findAll(@Query() filters: LeadFilterDto) {
    return this.service.findAll(filters);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lead statistics (admin)' })
  getStats() {
    return this.service.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lead by ID (admin)' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lead status (admin)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateLeadStatusDto) {
    return this.service.updateStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete lead (admin)' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
