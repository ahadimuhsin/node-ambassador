import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";

export const Ambassadors = async (req: Request, res: Response) => {

    const data = await getRepository(User).find({
        is_ambassador: true
    });

    res.send(data)
}