import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";

export const authMiddleware = async(req: Request, res: Response, next: Function) => {
    try {
        const jwt = req.cookies['jwt'];

        const payload: any = verify(jwt, process.env.SECRET_KEY);

        req["user"] = await getRepository(User)
        .findOne({where: {id: payload.id}});

        next();
    } catch (error) {
        return res.status(401).send({
            message: 'Unauthenticated'
        })
    }
}