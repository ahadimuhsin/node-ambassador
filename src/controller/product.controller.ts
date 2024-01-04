import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Product } from "../entity/product.entity";
import { client } from "..";

export const Products = async (req: Request, res: Response) => {
    const data = await getRepository(Product).find()

    res.send(data)
}

export const createProduct = async(req: Request, res: Response) => {
    
    const payload = await getRepository(Product).save({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
    })

    res.send(payload)
}

export const getProduct = async(req: Request, res: Response) => {
    
    const data = await getRepository(Product).findOne(req.params.id)

    if(!data)
    {
        res.send({
            "message": "Product Tidak Ditemukan"
        })
    }
    res.send(data)
}

export const updateProduct = async(req: Request, res: Response) => {
    const repository = getRepository(Product);

    await repository.update(req.params.id, req.body)

    res.send(await repository.findOne(req.params.id))
}


export const deleteProduct = async(req: Request, res: Response) => {
    const repository = getRepository(Product);

    const process = await repository.delete(req.params.id)

    if(process.affected < 1)
    {
        return res.status(400).send({
            "message" : "Data Not Found"
        })
    }

    res.send({
        "message" : "Data deleted successfully"
    })
}

export const ProductsFrontend = async(req: Request, res: Response) => {
    //cek apakah ada cache di redis
    let products = JSON.parse(await client.get('products_frontend'))
    
    //kalo tidak ada, ambil
    if(!products)
    {
        products = await getRepository(Product).find();

        await client.set('products_frontend', JSON.stringify(products), {
            EX: 1800, //30 menit
        });
    }
    
    res.send(products);
}