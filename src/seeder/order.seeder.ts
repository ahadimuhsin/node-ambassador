import { createConnection, getRepository } from "typeorm";
import {faker} from '@faker-js/faker'
import { User } from "../entity/user.entity";
import { Order } from "../entity/order.entity";
import { OrderItem } from "../entity/order-item.entity";
import { randomInt } from "crypto";

createConnection().then(async() => {
    const orderRepository = getRepository(Order);
    const orderItemRepository= getRepository(OrderItem);

    for (let i= 0; i < 30 ; i++)
    {
        const order = await orderRepository.save({
            user_id: randomInt(2,31),
            code: faker.random.alphaNumeric(6),
            ambassador_email: faker.internet.email(),
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            complete: true
        });

        for(let j = 0; j < randomInt(1,5); j++)
        {
            await orderItemRepository.save({
                order,
                product_title: faker.lorem.words(2),
                price: randomInt(10,100),
                quantity: randomInt(1,10),
                admin_revenue: randomInt(10,100),
                ambassador_revenue: randomInt(10,100),
            })
        }
    }

    process.exit();
})