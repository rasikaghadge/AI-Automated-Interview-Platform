import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.SECRET;

const companyAuth = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decodeData = jwt.verify(token, SECRET);
      console.log(decodeData);
      req.company = decodeData;
    } else {
      console.log("Invalid Company");
      res.send("Invalid Company");
    }
  } else {
    console.log("Invalid Company");
    res.send("Invalid Company");
  }
  next();
};

export default companyAuth;
