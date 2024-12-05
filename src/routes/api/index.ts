import { Router } from 'express';
import { courseRouter } from './userRoutes.js';
import { studentRouter } from './thoughtRoutes.js';

const router = Router();

router.use('/user', userRouter);
router.use('/thought', thoughtRouter);

export default router;
