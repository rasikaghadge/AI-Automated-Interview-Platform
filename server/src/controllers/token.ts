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
