import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({
        unique: true
    })
    email: string;

    // @Exclude
    @Column({select: false})
    password: string;

    @Column()
    is_ambassador: boolean;

    //get full name
    get fullName():string{
        return this.first_name + ' ' + this.last_name
    }
}