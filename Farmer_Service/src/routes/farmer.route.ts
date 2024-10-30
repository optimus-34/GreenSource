import { Router } from 'express';
import { createFarmer, getFarmers, getFarmer, updateFarmer, deleteFarmer,addFarmerAddress, updateFarmerName, updateFarmerPhone, updateFarmerAddress, updateFarmerEmail, updateFarmerVerifiedStatus, addProduct} from '../controllers/farmer.controller';
import { createAddress, deleteAddress, getAddress, getAddresses, updateAddress } from '../controllers/address.controller';


const router = Router();
router.post('/farmers', createFarmer);
router.put('/farmers/:id/addAddress', addFarmerAddress);
router.get('/farmers', getFarmers);
router.get('/farmers/:id', getFarmer);
router.put('/farmers/:id', updateFarmer);
router.put('/farmers/id/update/name', updateFarmerName);
router.put('/farmers/id/update/phone', updateFarmerPhone);
router.put('/farmers/update/Address/:id', updateFarmerAddress);
router.put('/farmers/id/update/email', updateFarmerEmail);
router.put('/farmers/id/update/is_verified', updateFarmerVerifiedStatus);
router.post('/farmers/add/product/',addProduct);
router.delete('/farmers/:id', deleteFarmer);
router.post('/address', createAddress);
router.get('/address', getAddresses);
router.get('/address/:id', getAddress);
router.put('/address/:id', updateAddress);
router.delete('/address/:id', deleteAddress);

export default router;