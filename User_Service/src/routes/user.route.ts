import { Router } from 'express';
import { createUser, getUsers, getUser, updateUser, deleteUser, getAdminUsers, getProducerUsers, getConsumerUsers, addUserAddress, updateUserName, updateUserPhone, updateUserAddress, updateUserEmail, updateUserPassword, updateUserVerifiedStatus, updateUserRole } from '../controllers/user.controller';
import { createAddress, deleteAddress, getAddress, getAddresses, updateAddress } from '../controllers/address.controller';

const router = Router();

router.post('/users', createUser);
router.get('/users/get/admin',getAdminUsers);
router.get('/users/get/producer',getProducerUsers);
router.get('/users/get/consumer',getConsumerUsers);
router.put('/users/:user_id/addAddress',addUserAddress);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.put('/users/:user_id/update/name',updateUserName);
router.put('/users/:user_id/update/phone',updateUserPhone);
router.put('/users/update/Address/:id',updateUserAddress);
router.put('/users/:user_id/update/email',updateUserEmail);
router.put('/users/:user_id/update/`password`',updateUserPassword);
router.put('/users/:user_id/update/is_verified',updateUserVerifiedStatus);
router.put('/users/:user_id/update/role',updateUserRole);
router.delete('/users/:id', deleteUser);
router.post('/address',createAddress);
router.get('/address',getAddresses);
router.get('/address/:id', getAddress);
router.put('/address/:id', updateAddress);
router.delete('/address/:id',deleteAddress);

export default router;