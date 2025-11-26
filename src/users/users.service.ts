import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {User} from './user.entity';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {
    }

    create(email: string, password: string) {
        // create with create then save and return save status
        const newUser = this.repo.create({ email, password });
        return this.repo.save(newUser);
    }


    findOne(id: number) {
        if(!id) {
            return null;
        }
        return this.repo.findOneBy({id});
    }


    find(email: string) {
        return this.repo.findBy({email});
    }


    async update(id: number, attrs: Partial<User>) {
        // find user first then change attrs and save ?
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
        
    }

    async remove(id: number) {
        const user = await this.findOne(id);

        if (!user) {
            throw new Error('User not found');
        }
        return this.repo.remove(user);
    }
}
