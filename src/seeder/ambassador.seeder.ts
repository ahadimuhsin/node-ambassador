import { createConnection, getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from 'bcryptjs'
import {faker} from '@faker-js/faker'

createConnection().then(async() => {
    const repository = getRepository(User);

    const password = await bcryptjs.hash("password", 10)

    for (let i= 0; i < 30 ; i++)
    {
        await repository.save({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: password,
            is_ambassador: true
        })
    }

    process.exit();
})