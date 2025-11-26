import {Test} from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { BadRequestException } from '@nestjs/common';

const scrypt = promisify(_scrypt);



describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async() => {
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email)
                return Promise.resolve(filteredUsers);
            },
            create: async (email: string, password: string) => {
                const user = {id: Math.floor(Math.random() * 99999), email: email, password:password} as User;
                users.push(user);
                return Promise.resolve(user);
            }
        }
    
        const module = await Test.createTestingModule({
            providers: [AuthService, 
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
    
        service = module.get(AuthService)
    })
    
    it('can create instance of auth service', async () => {
        // this is how the userservice (fake) will return when asked
        expect(service).toBeDefined();
    })

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('nut999anan@hotmai.com', 'Password');
        expect(user.password).not.toEqual('Password')

        const [salt, hash] = user.password.split('.')

        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('alreadyused@gmail.com', 'Not Correct Password')
        await expect(service.signup('alreadyused@gmail.com', 'Password')).rejects.toThrow(BadRequestException)
    });

    it('throws invalid credential when signin with unused email', async () => {
        await expect(service.signin('notemail', 'Password')).rejects.toThrow(BadRequestException)
    })

    it('throws invalid credential when signin with wrong pair of email and password', async () => {
        await service.signup('b@gmail.com', 'Not Correct Password')
        await expect(service.signin('b@gmail.com', 'Password')).rejects.toThrow(BadRequestException)
    })

    // check hashed password with different way ?
    it('return user if correct credential', async () => {
        // or set hashed password manually
        console.log("correct password and email")
        const signupUser = await service.signup('k@gmail.com', 'Password');
        console.log(signupUser)
        const user = await service.signin('k@gmail.com', 'Password')
        expect(user).toBeDefined()
    })

});
