import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const SECRET = process.env.SECRET;

export const auth = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        // Check if the authorization header is not present
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Authentication failed. Token not provided.' });
        }
        const token = authorizationHeader.split(" ")[1]
        const isCustomAuth = token.length < 500 

        let decodeData;

        //If token is custom token do this
        if(token && isCustomAuth) {
            try {
                decodeData = jwt.verify(token, SECRET);
                req.userId = decodeData?.id
                req.role = decodeData?.role || "candidate"
                req.permissions = decodeData?.permissions || []
                req.user = decodeData?.email
            } catch (error) {
                return res.status(401).json({ message: 'Authentication failed. Invalid Token.' });
            }

        } else {
            //Else of token is google token then do this
            decodeData = jwt.decode(token)
            req.userId = decodeData?.sub
            req.role = decodeData?.role || 'candidate'
        }

        next()

    } catch (error) {
        console.log(error);
        return error;
    }
}

export const admin = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        // Check if the authorization header is not present
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Authentication failed. Token not provided.' });
        }
        const token = authorizationHeader.split(" ")[1]
        const isCustomAuth = token.length < 500 

        let decodeData;

        //If token is custom token do this
        if(token && isCustomAuth) {
            decodeData = jwt.verify(token, SECRET)
            req.userId = decodeData?.id

        } else {
            //Else of token is google token then do this
            decodeData = jwt.decode(token)
            req.userId = decodeData?.sub
            req.role = decodeData?.role
        }

        next()

    } catch (error) {
        console.log(error)
    }
}

export const hrAuth = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        console.log(authorizationHeader)

        // Check if the authorization header is not present
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Authentication failed. Token not provided.' });
        }
        const token = authorizationHeader.split(" ")[1]
        const isCustomAuth = token.length < 500 

        let decodeData;

        //If token is custom token do this
        decodeData = jwt.verify(token, SECRET);
        console.log(decodeData);
        if(token && isCustomAuth) {
            decodeData = jwt.verify(token, SECRET)
            req.userId = decodeData?.id
            req.role = decodeData?.role
        } else {
            //Else of token is google token then do this
            decodeData = jwt.decode(token)
            req.userId = decodeData?.sub
        }

        next()

    } catch (error) {
        res.status(401).json({ message: 'Authentication failed. Invalid Token.' });
    }
}
