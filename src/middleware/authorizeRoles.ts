import {NextFunction, Response} from "express";
import {authRequest} from "./auth";


export const authorizeRoles = (...roles:string[]) =>{
    const allowRoles = new Set(roles.map(role => role.toString().toUpperCase()))

    return (req:authRequest, res:Response, next:NextFunction) => {
        const user = req.user

        if (!user) {
            return res.status(401).json({ message: 'Unauthenticated' });
        }

        const userRoles: (string)[] = Array.isArray(user.role)
            ? user.role.map(String)
            : (user.role ? [String(user.role)] : []);


        const hasAllowed = userRoles.some((role) => allowRoles.has(role));
        console.log(hasAllowed)

        if (!hasAllowed){
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next()
    }
}