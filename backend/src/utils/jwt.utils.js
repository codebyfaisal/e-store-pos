import jwt from "jsonwebtoken";

const generateToken = (payload, jwtSecret, expiresIn) => {
  return jwt.sign(payload, jwtSecret, { expiresIn });
};

const verifyToken = async (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(new Error("Invalid or expired token"));
      resolve(decoded);
    });
  });
};

export { generateToken, verifyToken };
