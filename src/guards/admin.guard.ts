import {CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'


export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        // why current user is request and if admin in that too ?
        // current user attach to currentUser object (User) to the request before controller or auth handle it  
        // it is wrong we need to change interceptor to middle ware to make it run before auth guard 

        if(!request.currentUser) {
            return false 
        }
        return request.currentUser.admin
    }
}