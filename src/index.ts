import express from "express";
import cors from 'cors';
import "reflect-metadata"
import { createConnection } from "typeorm";
import { routes } from "./routes";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {createClient} from "redis";

dotenv.config();
// redis setup
export const client = createClient({
    url: 'redis://redis:6379'
});

// console.log(client);

createConnection().then(async () => {
    await client.connect();

    const app = express();
    app.use(express.json());
    app.use(cookieParser())
    app.use(cors({
        origin: ['http://localhost:3000']
    }));

    routes(app);
    app.listen(8000, ()=> {
        console.log("It's running!")
    })
});
