import { Body, Controller, Get, Post, Patch, Delete, Param, Query, NotFoundException, Session, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('/auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService) {}

    @UseGuards(AuthGuard)
    @Get('/whoami')
    async whoAmI(@CurrentUser() user: User){
        if (!user) {
            throw new NotFoundException('User not signed in')
        }
        return user
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;    
    }



    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id
        return user
    }
    @Post('signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id 
        return user 
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log("Finding users")
        const user = await this.usersService.findOne(parseInt(id));
        if(!user) {
            throw new NotFoundException("No User with this id")
        }
        return user
    }

    @Get('/')
    async findAllUsers(@Query('email') email: string) {
        const users = await this.usersService.find(email);
        if(users.length <= 0) {
            throw new NotFoundException("No User with this email")
        }
        return users 
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto,) {
        return this.usersService.update(parseInt(id), body)
    }


    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id))
    }




}
