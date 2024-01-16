import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import { Order } from "../entity/order.entity";
import { client } from "..";

export const Ambassadors = async (req: Request, res: Response) => {

    const data = await getRepository(User).find({
        is_ambassador: true
    });

    res.send(data)
}

export const Rankings = async (req: Request, res: Response) => {
    const result: string[] = await client.sendCommand(['ZREVRANGEBYSCORE', 'rankings', '+inf', '-inf', 'WITHSCORES'])
    let name;
    res.send(result.reduce((o, r) => {
        //convert redis return to object
        if(isNaN(parseInt(r)))
        {
            name = r;
            return o;
        }
        else{
            return {
                ...o,
                [name]: parseInt(r)
            }
        }
    }, {}))
}