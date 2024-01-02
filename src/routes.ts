import { Router } from "express";
import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from "./controller/auth.controller";
import { authMiddleware } from "./middleware/auth.middleware";
import { Ambassadors } from "./controller/user.controller";
import { Products, createProduct, deleteProduct, getProduct, updateProduct } from "./controller/product.controller";

export const routes = (router: Router) => {
    router.post('/api/admin/register', Register);
    router.post('/api/admin/login', Login);
    router.get('/api/admin/user', authMiddleware ,AuthenticatedUser);
    router.post('/api/admin/logout', authMiddleware ,Logout);
    router.put('/api/admin/users/info', authMiddleware, UpdateInfo);
    router.put('/api/admin/users/password', authMiddleware, UpdatePassword);

    // ambassadors
    router.get('/api/admin/ambassadors', authMiddleware, Ambassadors);

    //products
    router.get('/api/admin/products', authMiddleware, Products);
    router.post('/api/admin/products', authMiddleware, createProduct);
    router.get('/api/admin/products/:id', authMiddleware, getProduct);
    router.put('/api/admin/products/:id', authMiddleware, updateProduct);
    router.delete('/api/admin/products/:id', authMiddleware, deleteProduct);
}    
