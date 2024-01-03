import { createConnection, getRepository } from "typeorm";
import {faker} from '@faker-js/faker'
import { Link } from "../entity/link.entity";
import { User } from "../entity/user.entity";
import { randomInt } from "crypto";

createConnection().then(async() => {
    const repository = getRepository(Link);

    for (let i= 0; i < 30 ; i++)
    {
        const user = new User()
        user.id = i + 1;

        await repository.save({
            code: faker.random.alphaNumeric(6),
            user : user,
            price : [randomInt(20, 10000)]
        })
    }

    process.exit();
})