import JWT from 'jsonwebtoken'

const authMiddleware = (req,res,next) =>{
    try {
        //extract token from authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({message : "no token provided"})
        }

        const token = authHeader.split(" ")[1]

        //verify token
        const decoded = JWT.verify(token, process.env.JWT_SECRET)

        //attach user data to request
        req.user = decoded

        next()
    } catch (error) {
        return res.status(401).json({message : "invalid or expired token"})
    }
}

export default authMiddleware;