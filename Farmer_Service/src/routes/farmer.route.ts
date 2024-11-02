import { Router } from 'express';
import { createFarmer, getFarmers, getFarmer, updateFarmer, deleteFarmer,addFarmerAddress, updateFarmerName, updateFarmerPhone, updateFarmerAddress, updateFarmerEmail, updateFarmerVerifiedStatus, addProduct, getProducts, loginFarmer} from '../controllers/farmer.controller';
import { createAddress, deleteAddress, getAddress, getAddresses, updateAddress } from '../controllers/address.controller';


const router = Router();
router.post('/farmers', createFarmer);
router.put('/farmers/:email/addAddress', addFarmerAddress);
router.get('/farmers', getFarmers);
router.get('/farmers/:email', getFarmer);
router.put('/farmers/:email', updateFarmer);
router.put('/farmers/:email/update/name', updateFarmerName);
router.put('/farmers/:email/update/phone', updateFarmerPhone);
router.put('/farmers/update/Address/:email', updateFarmerAddress);
router.put('/farmers/:email/update/email', updateFarmerEmail);
router.put('/farmers/:email/update/is_verified', updateFarmerVerifiedStatus);
router.post('/farmers/:email/add/product/',addProduct);
router.get('/farmers/:email/get/products',getProducts);
router.delete('/farmers/:email', deleteFarmer);
router.post('/address', createAddress);
router.get('/address', getAddresses);
router.get('/address/:id', getAddress);
router.put('/address/:id', updateAddress);
router.post('/login',loginFarmer);
router.delete('/address/:id', deleteAddress);

export default router;