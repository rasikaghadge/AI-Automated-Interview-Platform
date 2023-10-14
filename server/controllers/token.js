import jwt from 'jsonwebtoken';

// Create a token for the user
export const createToken = (email, id, role, expiresIn, SECRET) => {
    return jwt.sign({ 
        email, 
        id,
        role: role
    }, SECRET, {
        expiresIn: expiresIn
    });
}