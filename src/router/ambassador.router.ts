import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { Ambassadors } from "../controller/user.controller";
import { Login, Register, AuthenticatedUser, Logout, UpdateInfo, UpdatePassword } from "../controller/auth.controller";

export const ambassadorRoutes = (router: Router) =>  {

    // for admin to check list of ambassadors
    router.get('/api/admin/ambassadors', authMiddleware, Ambassadors);

    // for ambassador
    router.post('/api/ambassador/register', Register);
    router.post('/api/ambassador/login', Login);
    router.get('/api/ambassador/user', authMiddleware, AuthenticatedUser);
    router.post('/api/ambassador/logout', authMiddleware, Logout);
    router.put('/api/ambassador/users/info', authMiddleware, UpdateInfo);
    router.put('/api/ambassador/users/password', authMiddleware, UpdatePassword);
}