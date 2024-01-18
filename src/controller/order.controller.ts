import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { Order } from "../entity/order.entity";
import { Link } from "../entity/link.entity";
import { Product } from "../entity/product.entity";
import { OrderItem } from "../entity/order-item.entity";
import Stripe from "stripe";
import { client } from "..";
import { User } from "../entity/user.entity";
import { createTransport } from "nodemailer";

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

        const line_items = [];
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

            line_items.push({
                name: data.title,
                description: data.description,
                images: [data.image],
                amount: 100 * data.price,
                currency: 'usd',
                quantity: product.quantity
            });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2020-08-27'
        });

        const source = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            success_url: `${process.env.CHECKOUT_URL}/success?source={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CHECKOUT_URL}/error`
        });

        order.transaction_id = source['id'];

        await queryRunner.manager.save(order);

        //commit
        await queryRunner.commitTransaction();

        res.send({
            status: "Order created",
            data: source
        })
    } catch (error) {
        //rollback
        await queryRunner.rollbackTransaction();

        return res.status(400).send({
            message: "Error occured",
            error: error.message
        })
    }    
}

export const ConfirmOrder = async (req: Request, res: Response) => {
    const repository = getRepository(Order);

    const order = await repository.findOne({
        where: {
            transaction_id: req.body.source
        },
        relations: ['order_items']
    });

    if(!order)
    {
        return res.status(404).send({
            message: "Order Not Found",
        })
    }

    //update status order
    await repository.update(order.id, {
        complete: true
    });

    const user = await getRepository(User).findOne({
        where: {
            id: order.user_id
        }
    })

    //update ranking in redis
    await client.zIncrBy('rankings', order.ambassador_revenue, user.fullName);

    // send email to admin and ambassador
    const transporter = createTransport({
        host: 'host.docker.internal',
        port: 1025
    });

    await transporter.sendMail({
        from: 'no-reply@system.com',
        to: 'admin@mail.com',
        subject: "Order has been completed",
        html: `Order#${order.id} with a total of $${order.total} has been completed`
    });

    await transporter.sendMail({
        from: 'no-reply@system.com',
        to: order.ambassador_email,
        subject: "Order has been completed",
        html: `You earned $${order.ambassador_revenue} from the link #${order.code}`
    });

    await transporter.close();

    res.send({
        message: "success"
    })
}