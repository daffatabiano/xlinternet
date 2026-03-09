import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CoverageService } from './coverage.service';
import { JwtAuthGuard }    from '../../common/guards/jwt-auth.guard';

@ApiTags('coverage')
@Controller('coverage')
export class CoverageController {
  constructor(private readonly service: CoverageService) {}

  @Post('check')
  @ApiOperation({ summary: 'Check provider coverage by location' })
  check(@Body() body: { address: string; city: string; postalCode?: string }) {
    return this.service.check(body.address, body.city, body.postalCode);
  }

  @Get('cities')
  @ApiOperation({ summary: 'Get all available cities' })
  getCities() {
    return this.service.getCities();
  }

  @Post('areas/:providerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add coverage areas for a provider (admin)' })
  addAreas(
    @Param('providerId') providerId: string,
    @Body() body: { areas: { province: string; city: string; district?: string; postalCode?: string }[] },
  ) {
    return this.service.addCoverageArea(providerId, body.areas);
  }

  @Delete('areas/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a coverage area (admin)' })
  removeArea(@Param('id') id: string) {
    return this.service.removeCoverageArea(id);
  }
}
