import {
    createParamDecorator,
    ExecutionContext
} from '@nestjs/common'

// without decorator you need to directly find the data in request in the controller 
// decorator get the current user interceptor found to use it
export const CurrentUser = createParamDecorator((data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.CurrentUser
    return user
})