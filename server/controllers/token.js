import jwt from 'jsonwebtoken';

// Create a token for the user
export const createToken = (email, id, permissions, expiresIn, SECRET) => {
    return jwt.sign({ 
        email, 
        id,
        permissions: permissions
    }, SECRET, {
        expiresIn: expiresIn
    });
}