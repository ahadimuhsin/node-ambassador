import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { GetLink } from "../controller/link.controller";
import { CreateOrder } from "../controller/order.controller";

export const checkoutRoutes = (router: Router) =>  {
    router.get('/api/checkout/links/:code', GetLink);
    router.post('/api/checkout/orders', CreateOrder);
}