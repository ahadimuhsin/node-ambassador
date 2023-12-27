import express, {Request, Response} from "express";
import cors from 'cors';
import "reflect-metadata"
import { createConnection } from "typeorm";

createConnection().then(() => {
    const app = express();
    app.use(express.json());

    app.use(cors({
        origin: ['http://localhost:3000']
    }));

    //route
    app.get('/', (req: Request, res: Response) => {
        res.send("Running Well")
    })
    app.listen(8000, ()=> {
        console.log("It's running!")
    })
});
