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
        const response = await axios.get('http://localhost:8082/validate', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // If validation is successful, attach user info to request
        const user = response.data; // Adjust based on the response structure
        //res.status(200).json({ message: "user authenticated sucessfully" }); // Adjust based on the response structure
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error instanceof Error) {
            res.status(403).json({ message: 'Invalid token', error: error.message });
        } else {
            res.status(403).json({ message: 'Invalid token' });
        }
        return;
    }
    
};

