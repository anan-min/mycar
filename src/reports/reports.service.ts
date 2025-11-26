import { Injectable, NotFoundException } from '@nestjs/common';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import {GetEsimateDto} from './dtos/get-estimete.dto'

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto)
        report.user = user;
        return this.repo.save(report)
    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne({where: {
            id: parseInt(id)
        }});

        if(!report) {
            throw new NotFoundException('report not found')
        }

        report.approved = approved; 
        return this.repo.save(report);
    }


    async createEstimate({ make, model, lng, lat, year, mileage }: GetEsimateDto) {
        const result = await this.repo
            .createQueryBuilder('report')
            .select('AVG(report.price)', 'price')
            .where('report.make = :make', { make })
            .andWhere('report.model = :model', { model })
            .andWhere('report.lng BETWEEN :lng - 10 AND :lng + 10', { lng })
            .andWhere('report.lat BETWEEN :lat - 10 AND :lat + 10', { lat })
            .andWhere('report.year BETWEEN :year - 100 AND :year + 100', { year })
            .orderBy('ABS(report.mileage - :mileage)', 'ASC')
            .setParameters({ mileage })
            .limit(3)
            .getRawOne();

        console.log("result:", result);

        return {
            price: result?.price ?? null,
        };
    }

}
