import type { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}
export declare function authenticate(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=authenticate.d.ts.map