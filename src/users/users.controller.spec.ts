import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  
  beforeEach(async () => {
    let fakeUserService: Partial<UsersService>;
    let fakeAuthService: Partial<AuthService>;

    fakeUserService = {
      findOne: (id: number) => {

        if(id == 7) {
          throw new NotFoundException('User is not Found')
        }

        return Promise.resolve({id, email: 'someemail@gmail.com', password: 'somepassword'} as User)

      },
      find: (email: string) => {
      
        if(email == "notemail@gmail.com") {
          return Promise.resolve([])
        }

        return Promise.resolve([{id: 1, email, password: 'somepassword'} as User])
      },
      // remove: () => {},
      // update: () => {}
    };

    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({id:1, email, password} as User)
      }
    };


    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [ 
        
      {
        provide: UsersService,
        useValue: fakeUserService
      }, 
      {
        provide: AuthService,
        useValue: fakeAuthService
      }]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('findAllUsers returns a list of users with the given email', async() => {
    const users = await controller.findAllUsers('a@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('a@gmail.com')
  });


  it('findUser ', async() => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });


  it('findUser with id that is not exist will throw and error', async() => {
    await expect(controller.findUser('7')).rejects.toThrow(NotFoundException)
  });


  it('findUser with id that is not exist will throw and error', async() => {
    await expect(controller.findAllUsers('notemail@gmail.com')).rejects.toThrow(NotFoundException)
  });


  it('signin updates session object and retunruser', async() => {
    const session = {userId: -10};
    const user = await controller.signin({email: "a@gmail.com", password: "password"}, session);
    
    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  });



});
