import {
    IsString, IsNumber, Min, Max,
    IsLatitude,
    IsLongitude
} from 'class-validator'

import { Transform } from 'class-transformer';

export class GetEsimateDto { 
    @IsString()
    make: string; 
    
    @IsString()
    model: string; 

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1900)
    @Max(2500)
    year: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLongitude()
    lng: number; 

    @Transform(({ value }) => parseFloat(value))
    @IsLatitude()
    lat: number;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(0)
    @Max(10000000)
    mileage: number;
}