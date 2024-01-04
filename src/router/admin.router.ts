import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from "../controller/auth.controller";

export const adminRoutes = (router: Router) => {
    router.post('/api/admin/register', Register);
    router.post('/api/admin/login', Login);
    router.get('/api/admin/user', authMiddleware ,AuthenticatedUser);
    router.post('/api/admin/logout', authMiddleware ,Logout);
    router.put('/api/admin/users/info', authMiddleware, UpdateInfo);
    router.put('/api/admin/users/password', authMiddleware, UpdatePassword);
}