import { Request, Response, NextFunction } from 'express';

export function authorizeAdminRole(req: Request, res: Response, next: NextFunction) {
    const userRole = req.body?.role

    if (userRole === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
};
