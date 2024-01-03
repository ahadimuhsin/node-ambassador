import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Order } from "../entity/order.entity";

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