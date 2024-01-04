import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { Products, createProduct, deleteProduct, getProduct, updateProduct } from "../controller/product.controller";

export const productRoutes = (router: Router) => {
    router.get('/api/admin/products', authMiddleware, Products);
    router.post('/api/admin/products', authMiddleware, createProduct);
    router.get('/api/admin/products/:id', authMiddleware, getProduct);
    router.put('/api/admin/products/:id', authMiddleware, updateProduct);
    router.delete('/api/admin/products/:id', authMiddleware, deleteProduct);
}