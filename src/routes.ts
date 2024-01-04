import { Router } from "express";
import { ambassadorRoutes } from "./router/ambassador.router";
import { adminRoutes } from "./router/admin.router";
import { productRoutes } from "./router/product.router";
import { linkRoutes } from "./router/link.router";
import { orderRoutes } from "./router/order.router";

export const routes = (router: Router) => {
    // admin route
    adminRoutes(router)

    // ambassadors route
    ambassadorRoutes(router)

    //products route
    productRoutes(router)

    // link
    linkRoutes(router)

    // Orders
    orderRoutes(router)
}    
