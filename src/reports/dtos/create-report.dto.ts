import {
    IsString, isLatitude, isLongitude, IsNumber, Min, Max,
    IsLatitude,
    IsLongitude
} from 'class-validator'

export class CreateReportDto {
    @IsNumber()
    @Min(0)
    @Max(1000000)
    price: number;
    
    @IsString()
    make: string; 
    
    @IsString()
    model: string; 

    @IsNumber()
    @Min(1900)
    @Max(2500)
    year: number;

    @IsLongitude()
    lng: number; 

    @IsLatitude()
    lat: number;

    @IsNumber()
    @Min(0)
    @Max(10000000)
    mileage: number;
}