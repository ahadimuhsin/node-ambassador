import { createConnection, getRepository } from "typeorm";
import {faker} from '@faker-js/faker'
import { Product } from "../entity/product.entity";
import { randomInt } from "crypto";

createConnection().then(async() => {
    const repository = getRepository(Product);

    for (let i= 0; i < 20 ; i++)
    {
        await repository.save({
            title: faker.lorem.words(2),
            description: faker.lorem.words(10),
            image: faker.image.url(),
            price: randomInt(100, 10000000)
        })
    }

    process.exit();
})