import { Request, Response } from 'express';
import User from '../model/user.model';
import Address from '../model/address.model';



// Create a new user
export const createUser = async (req: Request, res: Response) => {
    try {
        // Step 1: Create addresses
    const addressData = req.body.addresses; // Assuming addresses data is in req.body.addresses
    const addressDocs = await Address.insertMany(addressData);
    const addressIds = addressDocs.map(address => address._id); // Get address IDs
    // Step 2: Create user with address IDs
    const userData = {
        ...req.body,
        addresses: addressIds, // Associate address IDs with the user
    };
    const user = new User(userData);
    await user.save();
    res.status(201).json(user);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating user:', error.message); // Log the error message
            res.status(500).json({ message: 'Error creating user', error: error.message });
        } else {
            // Fallback if error is not of type Error
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
        console.log("User details fetched successfully");

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching user:', error.message); // Log the error message
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        } else {
            // Fallback if error is not of type Error
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Get a single user
export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching user:', error.message); // Log the error message
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        } else {
            // Fallback if error is not of type Error
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating user:', error.message); // Log the error message
            res.status(500).json({ message: 'Error updating user', error: error.message });
        } else {
            // Fallback if error is not of type Error
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting user:', error.message); // Log the error message
            res.status(500).json({ message: 'Error deleting user', error: error.message });
        } else {
            // Fallback if error is not of type Error
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Get all Admin users
export const getAdminUsers = async (req: Request, res: Response) => {
    try {
        const adminUsers = await User.find({ role: 'admin' });
        res.json(adminUsers);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching admin user:', error.message); // Log the error message
            res.status(500).json({ message: 'Error fetching admin user', error: error.message });
        } else {
            // Fallback if error is not of type Error
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Get all Producer users
export const getProducerUsers = async (req: Request, res: Response) => {
    try {
        const producerUsers = await User.find({ role: 'producer' });
        res.json(producerUsers);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching producer user:', error.message); // Log the error message
            res.status(500).json({ message: 'Error fetching producer user', error: error.message });
        } else {
            // Fallback if error is not of type Error
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Get all Consumer users
export const getConsumerUsers = async (req: Request, res: Response) => {
    try {
        const consumerUsers = await User.find({ role: 'consumer' });
        res.json(consumerUsers);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching consumer user:', error.message); // Log the error message
            res.status(500).json({ message: 'Error fetching consumer user', error: error.message });
        } else {
            // Fallback if error is not of type Error
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

export const addUserAddress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Get user ID from request parameters
        const addressData = req.body; // Get address data from request body
        
        // Create a new address
        const newAddress = new Address(addressData);
        await newAddress.save(); // Save the address to the database

        // Update the user to include the new address ID
        await User.findByIdAndUpdate(id, { $push: { addresses: newAddress._id } }, { new: true });

        res.status(201).json(newAddress); // Respond with the created address
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error adding user address:', error.message);
            res.status(500).json({ message: 'Error adding user address', error: error.message });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Update user name
export const updateUserName = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.user_id, { name: req.body.name }, { new: true });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user name:', error);
        res.status(500).json({ message: 'Error updating user name', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};

// Update user phone
export const updateUserPhone = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.user_id, { phone: req.body.phone }, { new: true });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user phone:', error);
        res.status(500).json({ message: 'Error updating user phone', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};

// Update user email
export const updateUserEmail = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.user_id, { email: req.body.email }, { new: true });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user email:', error);
        res.status(500).json({ message: 'Error updating user email', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};

// Update user address by ID
export const updateUserAddress = async (req: Request, res: Response) => {
    try {
        const { user_id, id } = req.params;
        const updatedAddress = await Address.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedAddress) {
            res.status(404).json({ message: 'Address not found' });
        }
        res.json(updatedAddress);
    } catch (error) {
        console.error('Error updating user address:', error);
        res.status(500).json({ message: 'Error updating user address', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};

// Update user password
export const updateUserPassword = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.user_id, { password: req.body.password }, { new: true });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user password:', error);
        res.status(500).json({ message: 'Error updating user password', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};

// Update user verified status
export const updateUserVerifiedStatus = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.user_id, { is_verified: req.body.is_verified }, { new: true });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user verified status:', error);
        res.status(500).json({ message: 'Error updating user verified status', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.user_id, { role: req.body.role }, { new: true });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Error updating user role', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};