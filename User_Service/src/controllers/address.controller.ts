import { Request, Response } from 'express';
import Address from '../model/address.model';
import User from '../model/user.model';

// Create a new address
export const createAddress = async (req: Request, res: Response) => {
    try {
        const addressData = req.body; // Get address data from request body
        const newAddress = new Address(addressData);
        await newAddress.save();
        res.status(201).json(newAddress);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating address:', error.message);
            res.status(500).json({ message: 'Error creating address', error: error.message });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Get all addresses
export const getAddresses = async (req: Request, res: Response) => {
    try {
        const addresses = await Address.find();
        res.json(addresses);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching addresses:', error.message);
            res.status(500).json({ message: 'Error fetching addresses', error: error.message });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Get a single address by ID
export const getAddress = async (req: Request, res: Response) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            res.status(404).json({ message: 'Address not found' });
        }
        res.json(address);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching address:', error.message);
            res.status(500).json({ message: 'Error fetching address', error: error.message });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Update an address
export const updateAddress = async (req: Request, res: Response) => {
    try {
        const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAddress) {
            res.status(404).json({ message: 'Address not found' });
        }
        res.json(updatedAddress);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating address:', error.message);
            res.status(500).json({ message: 'Error updating address', error: error.message });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Delete an address
export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const deletedAddress = await Address.findByIdAndDelete(req.params.id);
        if (!deletedAddress) {
            res.status(404).json({ message: 'Address not found' });
        }
        res.json({ message: 'Address deleted' });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting address:', error.message);
            res.status(500).json({ message: 'Error deleting address', error: error.message });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Associate an address with a user
export const associateAddressWithUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params; // Get user ID from request parameters
        const addressData = req.body; // Get address data from request body
        
        // Create a new address
        const newAddress = new Address(addressData);
        await newAddress.save(); // Save the address to the database

        // Update the user to include the new address ID
        await User.findByIdAndUpdate(userId, { $push: { addresses: newAddress._id } }, { new: true });

        res.status(201).json(newAddress); // Respond with the created address
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error associating address with user:', error.message);
            res.status(500).json({ message: 'Error associating address with user', error: error.message });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};
