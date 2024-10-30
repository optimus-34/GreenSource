// src/middleware/authenticate.ts
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];

    // Ensure token is defined
    if (!token) {
         res.status(401).json({ message: 'Access token required' });
         return;
    }

    try {
        // Send token to authentication service for validation
        const response = await axios.get('http://localhost:8082/api/users/validateToken', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // If validation is successful, attach user info to request
        const user = response.data; // Adjust based on the response structure
        res.status(200).json({ user }); // Adjust based on the response structure
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
        return;
    }
};

