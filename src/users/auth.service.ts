import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { NotFoundError } from "rxjs";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private userService: UsersService){}


    async signup(email: string, password: string) {
        // check if email is in used 
        const users = await this.userService.find(email)
        if (users.length > 0){
            throw new BadRequestException("Email in use");
        }
        // hash user password 
        const salt = randomBytes(8).toString('hex');
        const hash = await scrypt(password, salt, 32) as Buffer;
        const result = salt + '.' + hash.toString('hex');
        // create new user and save to db 
        const user = await this.userService.create(email, result)
        // return user 
        return user
    }
    async signin(email: string, password: string) {
        // find user with email
        const [user] = await this.userService.find(email)
        if (!user) {
            throw new BadRequestException("Wrong Crendential")
        }

        const [salt, storedHash] = user.password.split('.');

        // Hash the provided password using the same salt
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Compare the computed hash with the stored hash
        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException("Invalid Credentials");
        }

        // If everything matches, return the user
        return user;
    }
} 