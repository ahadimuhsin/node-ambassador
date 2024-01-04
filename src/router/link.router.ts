import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { Links } from "../controller/link.controller";

export const linkRoutes = (router: Router) =>  {
    router.get('/api/admin/users/:id/links', authMiddleware, Links);
}