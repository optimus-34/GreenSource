import { Request, Response } from 'express';
import Farmer from '../model/farmer.model';
import Address from '../model/address.model';
import axios from 'axios';





// Create a new Farmer
export const createFarmer = async (req: Request, res: Response) => {
    try {
        // Step 1: Create addresses
    const addressData = req.body.addresses; // Assuming addresses data is in req.body.addresses
    const addressDocs = await Address.insertMany(addressData);
    const addressIds = addressDocs.map(address => address._id); // Get address IDs
    // Step 2: Create Farmer with address IDs
    const farmerData = {
        ...req.body,
        addresses: addressIds, // Associate address IDs with the Farmer
    };
    const farmer = new Farmer(farmerData);
    await farmer.save();
    res.status(201).json(farmer);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating Farmer:', error.message); // Log the error message
            res.status(500).json({ message: 'Error creating Farmer', error: error.message });
        } else {
            // Fallback if error is not of type Error
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Get all Farmers
export const getFarmers = async (req: Request, res: Response) => {
    try {
        const farmers = await Farmer.find();
        res.json(farmers);
        console.log("Farmer details fetched successfully");

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching Farmer:', error.message); // Log the error message
            res.status(500).json({ message: 'Error fetching Farmer', error: error.message });
        } else {
            // Fallback if error is not of type Error
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Get a single Farmer
export const getFarmer = async (req: Request, res: Response) => {
    try {
        const farmer = await Farmer.findById(req.params.id);
        res.json(farmer);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching Farmer:', error.message); // Log the error message
            res.status(500).json({ message: 'Error fetching Farmer', error: error.message });
        } else {
            // Fallback if error is not of type Error
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Update a Farmer
export const updateFarmer = async (req: Request, res: Response) => {
    try {
        const farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(farmer);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating Farmer:', error.message); // Log the error message
            res.status(500).json({ message: 'Error updating Farmer', error: error.message });
        } else {
            // Fallback if error is not of type Error
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Delete a Farmer
export const deleteFarmer = async (req: Request, res: Response) => {
    try {
        await Farmer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Farmer deleted' });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting Farmer:', error.message); // Log the error message
            res.status(500).json({ message: 'Error deleting Farmer', error: error.message });
        } else {
            // Fallback if error is not of type Error
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};


// Add Product - communicates with product service
export const addProduct = async (req: Request, res: Response) => {
    try {
      const productData = req.body; // Get product data from request body
      const farmerId = req.params.id; // Get farmer ID from request parameters
      // Include the farmer ID in the product data
      productData.farmerId = farmerId;
      // Send POST request to product service
      const response = await axios.post('http://localhost:3001/api/products', productData);
      // Update the Farmer's list_products with the new product ID
      const productId = response.data._id; // Assuming the product ID is returned in the response
      await Farmer.findByIdAndUpdate(farmerId, { $push: { list_products: productId } });
      res.status(201).json(response.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error communicating with product service:', error.message);
        res.status(500).json({ message: 'Error communicating with product service', error: error.message });
      } else {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  export const getProducts = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Get Farmer ID from request parameters
        // Find the farmer and retrieve their product IDs
        const farmer = await Farmer.findById(id);
        if (!farmer) {
            res.status(404).json({ message: 'Farmer not found' });
            return;
        }
        const productIds = farmer.list_products; // Assuming this contains the product IDs
        const products = [];
        // Fetch products one by one
        for (const productId of productIds) {
            const response = await axios.get(`http://localhost:3001/api/product/${productId}`);
            products.push(response.data); // Collect product data
        }
        res.json(products); // Return the fetched product data
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching products:', error.message);
            res.status(500).json({ message: 'Error fetching products', error: error.message });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};
  




export const addFarmerAddress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Get Farmer ID from request parameters
        const addressData = req.body; // Get address data from request body
        
        // Create a new address
        const newAddress = new Address(addressData);
        await newAddress.save(); // Save the address to the database

        // Update the Farmer to include the new address ID
        await Farmer.findByIdAndUpdate(id, { $push: { addresses: newAddress._id } }, { new: true });

        res.status(201).json(newAddress); // Respond with the created address
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error adding Farmer address:', error.message);
            res.status(500).json({ message: 'Error adding Farmer address', error: error.message });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

// Update Farmer name
export const updateFarmerName = async (req: Request, res: Response) => {
    try {
        const farmer = await Farmer.findByIdAndUpdate(req.params.id, { first_name: req.body.firstName,last_name: req.body.lastName }, { new: true });
        if (!farmer) {
            res.status(404).json({ message: 'Farmer not found' });
        }
        res.json(Farmer);
    } catch (error) {
        console.error('Error updating Farmer name:', error);
        res.status(500).json({ message: 'Error updating Farmer name', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};

// Update Farmer phone
export const updateFarmerPhone = async (req: Request, res: Response) => {
    try {
        const farmer = await Farmer.findByIdAndUpdate(req.params.id, { phone: req.body.phone }, { new: true });
        if (!farmer) {
            res.status(404).json({ message: 'Farmer not found' });
        }
        res.json(Farmer);
    } catch (error) {
        console.error('Error updating Farmer phone:', error);
        res.status(500).json({ message: 'Error updating Farmer phone', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};

// Update Farmer email
export const updateFarmerEmail = async (req: Request, res: Response) => {
    try {
        const farmer = await Farmer.findByIdAndUpdate(req.params.id, { email: req.body.email }, { new: true });
        if (!farmer) {
            res.status(404).json({ message: 'Farmer not found' });
        }
        res.json(Farmer);
    } catch (error) {
        console.error('Error updating Farmer email:', error);
        res.status(500).json({ message: 'Error updating Farmer email', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};

// Update Farmer address by ID
export const updateFarmerAddress = async (req: Request, res: Response) => {
    try {
        
        const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAddress) {
            res.status(404).json({ message: 'Address not found' });
        }
        res.json(updatedAddress);
    } catch (error) {
        console.error('Error updating Farmer address:', error);
        res.status(500).json({ message: 'Error updating Farmer address', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};


// Update Farmer verified status
export const updateFarmerVerifiedStatus = async (req: Request, res: Response) => {
    try {
        const farmer = await Farmer.findByIdAndUpdate(req.params.id, { is_verified: req.body.is_verified }, { new: true });
        if (!farmer) {
            res.status(404).json({ message: 'Farmer not found' });
        }
        res.json(Farmer);
    } catch (error) {
        console.error('Error updating Farmer verified status:', error);
        res.status(500).json({ message: 'Error updating Farmer verified status', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};

// Update Farmer role
export const updateFarmerRole = async (req: Request, res: Response) => {
    try {
        const farmer = await Farmer.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
        if (!farmer) {
            res.status(404).json({ message: 'Farmer not found' });
        }
        res.json(farmer);
    } catch (error) {
        console.error('Error updating Farmer role:', error);
        res.status(500).json({ message: 'Error updating Farmer role', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};

export const loginFarmer = async (req: Request, res: Response) => {
    try {
        const farmer = await Farmer.findOne({ email: req.body.email });
        if (!farmer) {
            res.status(400).json({ message: 'Farmer not found' });
        }
        res.status(200).json({ success : true });
    } catch (error) {
        console.error('Error logging in Farmer:', error);
        res.status(500).json({ message: 'Error logging in Farmer', error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};