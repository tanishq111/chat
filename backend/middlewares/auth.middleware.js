import User from '../model/user.model.js';
import { verifyToken } from '../util/token.js';


const  protect = async (req, res, next) => {
    console.log('Protect middleware invoked', req.headers, req.cookies);
    const authHeader = req.headers.authorization;
    const token = req.cookies?.token ||
        (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

    if(!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = verifyToken(token);
        req.user = await User.findById(decoded.id);
        if(!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default protect;
