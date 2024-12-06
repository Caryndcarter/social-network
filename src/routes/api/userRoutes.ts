import { Router } from 'express';
const router = Router();
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../../controllers/userController.js';

// /api/user
router.route('/').get(getAllUsers).post(createUser);

// /api/user/:userId
router
  .route('/:userId')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export { router as userRouter };
