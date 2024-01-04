import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { Orders } from "../controller/order.controller";

export const orderRoutes = (router: Router) =>  {
    router.get('/api/admin/orders', authMiddleware, Orders)
}