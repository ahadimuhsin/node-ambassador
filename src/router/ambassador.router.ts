import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { Ambassadors } from "../controller/user.controller";

export const ambassadorRoutes = (router: Router) =>  {
    router.get('/api/admin/ambassadors', authMiddleware, Ambassadors);
}