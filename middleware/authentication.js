import jwt  from "jsonwebtoken";

export const authenticationHandler = (req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization){
        res.status(401);
        throw new Error('token missing')
    }
    const token = authorization.split(" ")[1];
    if(!token){
        res.status(401);
        throw new Error('Not Authorized');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    console.log(decoded);
    next();
}