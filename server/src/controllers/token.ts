import jwt from 'jsonwebtoken';

// Create a token for the user
export const createToken = (email: string, id: any, role: string, expiresIn: any, SECRET: any) => {
    return jwt.sign({ 
        email, 
        id,
        role: role,
        version: 2
    }, SECRET, {
        expiresIn: expiresIn
    });
}

export const verifyToken = (token: string, SECRET: string) => {
    try {
        const decoded = jwt.verify(token, SECRET);
        return decoded;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new Error('Token is expired login again')
        } else {
            throw err;
        }
    }
}