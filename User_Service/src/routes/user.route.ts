import { Router } from 'express';
import { createUser, getUsers, getUser, updateUser, deleteUser, getAdminUsers, getProducerUsers, getConsumerUsers, addUserAddress, updateUserName, updateUserPhone, updateUserAddress, updateUserEmail, updateUserPassword, updateUserVerifiedStatus, updateUserRole } from '../controllers/user.controller';

const router = Router();

router.post('/users', createUser);
router.get('/users/admin',getAdminUsers);
router.get('/users/producer',getProducerUsers);
router.get('/users/consumer',getConsumerUsers);
router.put('/users/addAddress',addUserAddress);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:user_id/update/name',updateUserName);
router.put('/users/:user_id/update/phone',updateUserPhone);
router.put('/users/:user_id/update/Address/id',updateUserAddress);
router.put('/users/:user_id/update/email',updateUserEmail);
router.put('/users/:user_id/update/password',updateUserPassword);
router.put('/users/:user_id/update/is_verified',updateUserVerifiedStatus);
router.put('/users/:user_id/update/role',updateUserRole);

export default router;