import {
    UseInterceptors,
    NestInterceptor, 
    ExecutionContext,
    CallHandler
} from '@nestjs/common'

import { Observable } from 'rxjs'
import {map} from 'rxjs/operators'
import { plainToInstance } from 'class-transformer'


interface ClassConstructor {
    new (...args: any[]) : {}
}


export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {

    constructor (private dto: ClassConstructor) {
        this.dto = dto;
    }

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        //  Run before handle
        // console.log("Before Handle")
        return handler.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {excludeExtraneousValues: true});
                // Run before send out
                // console.log("Before Send Out")
            })
        )
    }
}