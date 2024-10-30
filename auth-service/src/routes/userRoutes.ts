import { Router } from 'express';
import { addUser, getUserDetails, updateUser, deleteUser, getAllUsers,register, login , validateToken} from '../controller/userController';

const router = Router();

router.post('/user', addUser);
router.get('/user/:id', getUserDetails);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);
router.get('/users', getAllUsers);
router.post('/register', register);
router.post('/login', login);
router.get('/validate', validateToken);

export default router;
