import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  // if(token == null) return res.sendStatus(401);
  if(!token) return res.status(401).json({msg: "Token not detected"});
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    // if(err) return res.sendStatus(403);
    if(err) return res.status(403).json({msg: err.message});
    req.uuid = decoded.uuid;
    next();
  })
}

export const verifySession = (req, res, next) => {
  const token = req.headers.token;
  // const token = req.cookies.token;
  if(!token) return res.status(401).json({msg: "Mohon Login ke akun anda!"});
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if(err) return res.status(403).json({msg: err.message});
    req.uuid = decoded.uuid;
    req.token = token;
    next();
  })
}