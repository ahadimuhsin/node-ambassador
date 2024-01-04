import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from 'bcryptjs'
import { sign } from "jsonwebtoken";
import { Order } from "../entity/order.entity";

export const Register = async (req: Request, res: Response) => {
    const {password, password_confirm, ...body} = req.body;

    if(password !== password_confirm)
    {
        return res.status(400).send({
            message: "Password do not match"
        });
    }

    try{
        const user = await getRepository(User).save({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            is_ambassador: req.path === '/api/ambassador/register',
            password: await bcryptjs.hash(password, 10),
        });

        delete user.password;

        res.send(user);
    }
    catch(error)
    {
        if(error.code === "ER_DUP_ENTRY")
        {
            return res.status(400).send({
                message: "Email sudah digunakan"
            });
        }
        console.log(error);
    }    
}

export const Login = async (req: Request, res: Response) => {
    const user = await getRepository(User).findOne({
        email: req.body.email
    }, {
        select: ["password", "id", "is_ambassador"]
    });

    if(!user)
    {
        return res.status(400).send({
            message: "User not found"
        });
    }

    // compare password
    const compare = await bcryptjs.compare(req.body.password, user.password);

    const adminLogin = req.path === '/api/admin/login';

    if(!compare)
    {
        return res.status(400).send({
            message: "Invalid credentials"
        });
    }

    //restrict ambassador to login from admin route
    if(user.is_ambassador && adminLogin)
    {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }

    const token = sign({
        id: user.id,
        user : user.first_name + user.last_name,
        email: user.email,
        is_ambassador: user.is_ambassador,
        scope: adminLogin ? "admin" : "ambassador"
    }, process.env.SECRET_KEY);

    //create cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    res.send({
        message: "Login Success",
    });
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    const user = req['user'];

    //cek apakah request berasal dari admin atau ambassador
    if(req.path === '/api/admin/user')
    {
        return res.send(user)
    }
    
    //kalau dari ambassador, dapatkan juga info ambassador_revenuenya
    const orders = await getRepository(Order).find({
        where: {
            user_id: user.id,
            complete: true 
        },
        relations: ['order_items']
    });

    user.revenue = orders.reduce((s, o) => s + o.ambassador_revenue, 0)

    res.send(user)
}

export const Logout = async(req: Request, res: Response) => {
    //delete cookie jwt
    res.cookie("jwt", "", {maxAge: 0});

    res.send({
        message: "Logout success"
    })
}

export const UpdateInfo = async(req: Request, res: Response) => {
    const user = req['user'];
    const repository = getRepository(User);
    await repository.update(user.id, req.body);
    // console.log("Cekcekcekeck");
    res.send(await repository.findOne(user.id));
}

export const UpdatePassword = async(req: Request, res: Response) => {
    const user = req['user'];

    const getPassword = await getRepository(User).findOne({
        id: user.id
    }, {
        select: ["password", "id"]
    });

    const compare = await bcryptjs.compare(req.body.current_password, getPassword.password);

    if(!compare)
    {
        return res.status(400).send({
            message: "Current Password do not match"
        });
    }

    if(req.body.password !== req.body.password_confirm)
    {
        return res.status(400).send({
            message: "Password do not match"
        });
    }

    await getRepository(User).update(user.id, {
        password: await bcryptjs.hash(req.body.password, 10)
    });

    res.send(user);
}