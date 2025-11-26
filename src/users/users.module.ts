import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-users.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, 
    // this apply to every controller in the app ? but why place here not in the app
    // or we could export and apply there too ?
    {
      provide: APP_INTERCEPTOR,
      useClass:CurrentUserInterceptor
    }
  ]
})
export class UsersModule {
  
}
