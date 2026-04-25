import jwt  from 'jsonwebtoken';
function authMiddleware(req,res,next){
    try{
        // Check header first, fallback to cookie
        const authHeader = req.headers.authorization;
        const token = (authHeader && authHeader.startsWith('Bearer ')) 
            ? authHeader.split(' ')[1] 
            : req.cookies.token;

        if(!token) return res.status(401).json({msg:"Unauthorized - No token"})
        const verify=jwt.verify(token,process.env.JWT_SECRET);
        req.user=verify;
        next();
    }catch(error){
       return res.status(401).json({msg:"Unauthorized - Invalid token"});
    }
}
export default authMiddleware;