import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { Report } from 'src/reports/report.entity';

import { AfterInsert, AfterRemove, AfterUpdate } from 'typeorm';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    email: string;
    
    @Column()
    password: string;


    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    @AfterInsert()
    logInsert() {   
        console.log(`Inserted User with id: ${this.id} and email: ${this.email}`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Updated User with id: ${this.id} and email: ${this.email}`);
    }

    @AfterRemove()
    logRemove() {
        console.log(`Removed User with id: ${this.id} and email: ${this.email}`);
    }
}
