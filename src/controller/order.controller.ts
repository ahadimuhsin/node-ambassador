import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { Order } from "../entity/order.entity";
import { Link } from "../entity/link.entity";
import { Product } from "../entity/product.entity";
import { OrderItem } from "../entity/order-item.entity";

export const Orders = async (req: Request, res: Response) => {
    
    const orders = await getRepository(Order).find({
        where: {
            complete: true
        },
        relations: ['order_items']
    });

    res.send(orders.map((order: Order) => {
        return {
            id: order.id,
            name: order.fullName,
            email: order.email,
            total: order.total,
            created_at: order.created_at,
            order_items: order.order_items
        }
    }));
}

export const CreateOrder = async(req: Request, res: Response) =>
{
    //get the body
    const body = req.body;

    //get link data
    const link = await getRepository(Link).findOne({
        where: {
            code: body.code
        },
        relations: ['user']
    });

    if(!link)
    {
        return res.status(400).send({
            message: "Invalid link"
        })
    }

    // query runner = db transactions
    const queryRunner = getConnection().createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

        // save to order table
        let order = new Order();
        order.user_id = link.user.id;
        order.ambassador_email = link.user.email
        order.code = body.code
        order.first_name = body.first_name
        order.last_name = body.last_name
        order.email = body.email
        order.address = body.address
        order.country = body.country
        order.city = body.city
        order.zip_code = body.zip_code

        order = await queryRunner.manager.save(order);

        for(let product of body.products)
        {
            const data = await getRepository(Product).findOne({
                where: {
                    id: product.product_id
                }
            });

            const orderItem = new OrderItem()
            orderItem.order = order
            orderItem.product_title = data.title
            orderItem.price = data.price
            orderItem.quantity = product.quantity
            orderItem.ambassador_revenue = (data.price * product.quantity) * 0.1 //10%
            orderItem.admin_revenue = (data.price * product.quantity) * 0.9 //90%

            await queryRunner.manager.save(orderItem)
        }

        //commit
        await queryRunner.commitTransaction();

        res.send({
            status: "Order created",
            data: order
        })
    } catch (error) {
        //rollback
        await queryRunner.rollbackTransaction();

        return res.status(400).send({
            message: "Error occured"
        })
    }
    

    
}