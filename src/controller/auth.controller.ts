import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from 'bcryptjs'
import { sign } from "jsonwebtoken";

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
            is_ambassador: body.is_ambassador,
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
        select: ["password", "id"]
    });

    if(!user)
    {
        return res.status(400).send({
            message: "User not found"
        });
    }

    // compare password
    const compare = await bcryptjs.compare(req.body.password, user.password);

    if(!compare)
    {
        return res.status(400).send({
            message: "Invalid credentials"
        });
    }

    const token = sign({
        id: user.id,
        user : user.first_name + user.last_name,
        email: user.email,
        is_ambassador: user.is_ambassador
    }, process.env.SECRET_KEY);

    //create cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    res.send({
        message: "Login Succes",
    });
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    res.send(req["user"]);    
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