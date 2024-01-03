import { Column, CreateDateColumn, Entity, 
    PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { Link } from "./link.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    transaction_id: string

    @Column()
    user_id: number

    @Column()
    code: string

    @Column()
    ambassador_email: string

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    email: string

    @Column("text", {nullable: true})
    address: string

    @Column({nullable: true})
    country: string
    
    @Column({nullable: true})
    city: string

    @Column({nullable: true})
    zip_code: string

    @Column( {default: false})
    complete: boolean

    @CreateDateColumn()
    created_at: string

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    order_items: OrderItem[]

    @ManyToOne(() => Link, link => link.orders, {
        createForeignKeyConstraints: false
    })
    @JoinColumn({
        referencedColumnName: 'code',
        name: 'code'
    })
    link: Link

    /** 
     * getter or accessor
     * */ 

    //get full name
    get fullName():string{
        return this.first_name + ' ' + this.last_name
    }

    // total of admin revenue
    get total(): number{
        return this.order_items.reduce((sum, item) => sum + item.admin_revenue, 0)
    }
}