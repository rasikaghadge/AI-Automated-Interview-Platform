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
            decodeData = jwt.verify(token, SECRET)
            req.userId = decodeData?.id

        } else {
            //Else of token is google token then do this
            decodeData = jwt.decode(token)
            req.userId = decodeData?.sub
        }

        next()

    } catch (error) {
        console.log(error)
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
            req.isAdmin = decodeData?.isAdmin

        } else {
            //Else of token is google token then do this
            decodeData = jwt.decode(token)
            req.userId = decodeData?.sub
            req.isAdmin = decodeData?.isAdmin
        }

        next()

    } catch (error) {
        console.log(error)
    }
}

export const hrAuth = async (req, res, next) => {
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
        decodeData = jwt.verify(token, SECRET);
        console.log(decodeData)
        if(token && isCustomAuth) {
            decodeData = jwt.verify(token, SECRET)
            req.userId = decodeData?.id
            req.isAdmin = decodeData?.isAdmin
            req.isHR = decodeData?.isHR

        } else {
            //Else of token is google token then do this
            decodeData = jwt.decode(token)
            req.userId = decodeData?.sub
            req.isAdmin = decodeData?.isAdmin
            req.isHR = decodeData?.isHR
        }

        next()

    } catch (error) {
        console.log(error)
    }
}
