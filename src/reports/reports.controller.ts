import { Controller, Post, Body, Patch, Param, Get, Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity'
import { ReportDto } from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { Admin } from 'typeorm';
import { GetEsimateDto } from './dtos/get-estimete.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService) {

    }

    @Post('/')
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportService.create(body, user);
    }


    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        return this.reportService.changeApproval(id, body.approved);
    }

    @Get('/')
    @UseGuards(AuthGuard)
    getEstimate(@Query() query: GetEsimateDto) {
        return this.reportService.createEstimate(query)
    }
}   
