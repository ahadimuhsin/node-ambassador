import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { CreateLink, Links, Stats } from "../controller/link.controller";

export const linkRoutes = (router: Router) =>  {
    router.get('/api/admin/users/:id/links', authMiddleware, Links);
    // create link
    router.post('/api/ambassador/links', authMiddleware, CreateLink);
    // stats
    router.get('/api/ambassador/stats', authMiddleware, Stats);
}