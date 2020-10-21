import jwt from "jsonwebtoken";
import { jwtTokenSecret } from "./secret.js";

export function authenticateJWT(roles) {
    return function(req, res, next) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];
    
            jwt.verify(token, jwtTokenSecret, (err, user) => {
                if (err || !roles.includes(user.role)) {
                    return res.sendStatus(403);
                }

                req.user = user;
                next();
            });
        } else {
            res.sendStatus(401);
        }
    }
  }